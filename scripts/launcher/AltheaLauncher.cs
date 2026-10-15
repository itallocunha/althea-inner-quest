using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

[assembly: AssemblyTitle("Althea - Iniciador")]
[assembly: AssemblyDescription("Abre o Althea local e controla seu servidor pela bandeja do Windows.")]
[assembly: AssemblyProduct("Althea Inner Quest")]
[assembly: AssemblyVersion("1.0.0.0")]

internal static class Launcher
{
    internal static int Port = 8080;
    internal static string SiteUrl { get { return "http://127.0.0.1:" + Port + "/"; } }
    internal static readonly string Root = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory).TrimEnd('\\', '/');
    internal static readonly string ProjectKey = Fingerprint(Root);
    internal static string InstanceName { get { return "Local\\Althea-" + ProjectKey + "-" + Port; } }
    private static readonly object LogLock = new object();
    internal static readonly string LogPath = Path.Combine(Root, "logs", "althea-launcher.log");

    [STAThread]
    private static int Main(string[] args)
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        // An alternate port is available for isolated launcher checks; double-click uses 8080.
        foreach (string argument in args)
        {
            int port;
            if (argument.StartsWith("--port=") && int.TryParse(argument.Substring(7), out port) && port >= 1024 && port <= 65535) Port = port;
        }
        if (Array.IndexOf(args, "--stop") >= 0)
        {
            try { using (var signal = EventWaitHandle.OpenExisting(InstanceName + "-Stop")) signal.Set(); return 0; }
            catch (WaitHandleCannotBeOpenedException) { return 0; }
        }

        bool created;
        using (var instance = new Mutex(true, InstanceName, out created))
        {
            bool openBrowser = Array.IndexOf(args, "--no-browser") < 0;
            if (!created)
            {
                // A second double-click reopens the site instead of starting another server.
                for (int attempt = 0; attempt < 100; attempt++)
                {
                    if (Probe() == SiteState.Ready)
                    {
                        if (openBrowser) OpenBrowser();
                        return 0;
                    }
                    Thread.Sleep(300);
                }
                MessageBox.Show("O Althea ainda está iniciando. Aguarde um momento e tente abrir novamente.", "Althea", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return 1;
            }
            try
            {
                using (var context = new LauncherContext(openBrowser))
                {
                    Application.Run(context);
                    return context.Failed ? 1 : 0;
                }
            }
            catch (Exception exception)
            {
                Log(exception.ToString());
                MessageBox.Show("Não foi possível iniciar o Althea.\n\n" + exception.Message, "Althea", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return 1;
            }
            finally { instance.ReleaseMutex(); }
        }
    }

    private static string Fingerprint(string root)
    {
        using (var hash = SHA256.Create())
            return BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(root.ToUpperInvariant()))).Replace("-", "").ToLowerInvariant().Substring(0, 24);
    }

    internal enum SiteState { Stopped, Ready, Busy }

    internal static SiteState Probe()
    {
        string identity = ReadUrl(SiteUrl + "__althea_launcher_status");
        if (identity != null && identity.Contains("\"application\":\"althea\""))
            return identity.Contains("\"project\":\"" + ProjectKey + "\"") ? SiteState.Ready : SiteState.Busy;

        // Reuse an Althea development server that was started through the original .bat.
        string page = ReadUrl(SiteUrl);
        if (page != null && page.IndexOf("<title>Althea", StringComparison.OrdinalIgnoreCase) >= 0 && page.Contains("/src/main.tsx") && page.Contains("id=\"root\""))
            return SiteState.Ready;
        foreach (var endpoint in IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners())
            if (endpoint.Port == Port) return SiteState.Busy;
        return SiteState.Stopped;
    }

    private static string ReadUrl(string url)
    {
        try
        {
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Proxy = null;
            request.AllowAutoRedirect = false;
            request.Timeout = 800;
            request.ReadWriteTimeout = 800;
            using (var response = (HttpWebResponse)request.GetResponse())
            using (var reader = new StreamReader(response.GetResponseStream()))
            {
                var buffer = new char[32768];
                int count = reader.ReadBlock(buffer, 0, buffer.Length);
                return new string(buffer, 0, count);
            }
        }
        catch (WebException) { return null; }
        catch (IOException) { return null; }
    }

    internal static string FindNode()
    {
        string[] locations = {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "nodejs", "node.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "nodejs", "node.exe")
        };
        foreach (string location in locations) if (File.Exists(location)) return location;
        foreach (string directory in (Environment.GetEnvironmentVariable("PATH") ?? "").Split(Path.PathSeparator))
        {
            try
            {
                string location = Path.Combine(directory.Trim('"'), "node.exe");
                if (File.Exists(location)) return location;
            }
            catch (ArgumentException) { }
        }
        throw new InvalidOperationException("O Node.js não foi encontrado. Instale o Node.js e abra este executável novamente.");
    }

    internal static void OpenBrowser()
    {
        Process.Start(new ProcessStartInfo(SiteUrl) { UseShellExecute = true });
        Log("Navegador padrão aberto em " + SiteUrl);
    }

    internal static void Log(string message)
    {
        lock (LogLock)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(LogPath));
                File.AppendAllText(LogPath, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + message + Environment.NewLine, Encoding.UTF8);
            }
            catch (IOException) { }
            catch (UnauthorizedAccessException) { }
        }
    }
}

internal sealed class LauncherContext : ApplicationContext
{
    private readonly Control dispatcher = new Control();
    private readonly NotifyIcon tray;
    private readonly EventWaitHandle stopSignal;
    private readonly bool openBrowser;
    private readonly object lifecycleLock = new object();
    private Process server;
    private ProcessJob job;
    private volatile bool closing;
    private volatile bool ready;
    private bool disposed;
    internal bool Failed { get; private set; }

    internal LauncherContext(bool openBrowser)
    {
        this.openBrowser = openBrowser;
        var handle = dispatcher.Handle;
        stopSignal = new EventWaitHandle(false, EventResetMode.AutoReset, Launcher.InstanceName + "-Stop");
        var menu = new ContextMenuStrip();
        menu.Items.Add("Abrir Althea", null, delegate { TryOpen(); });
        menu.Items.Add("Ver registro de inicialização", null, delegate {
            if (File.Exists(Launcher.LogPath)) Process.Start(new ProcessStartInfo(Launcher.LogPath) { UseShellExecute = true });
        });
        menu.Items.Add(new ToolStripSeparator());
        menu.Items.Add("Encerrar Althea", null, delegate { ExitThread(); });
        tray = new NotifyIcon {
            Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath) ?? SystemIcons.Application,
            Text = "Althea - iniciando...", ContextMenuStrip = menu, Visible = true
        };
        tray.DoubleClick += delegate { TryOpen(); };
        Task.Run((Action)StartServer);
        Task.Run(delegate {
            try { stopSignal.WaitOne(); OnUi(delegate { ExitThread(); }); }
            catch (ObjectDisposedException) { }
        });
    }

    private void StartServer()
    {
        try
        {
            Launcher.Log("Iniciando o Althea em " + Launcher.Root);
            var state = Launcher.Probe();
            if (state == Launcher.SiteState.Ready)
            {
                OnUi(delegate {
                    Launcher.Log("Servidor existente reutilizado.");
                    ready = true;
                    if (openBrowser) TryOpen();
                    ExitThread();
                });
                return;
            }
            if (state == Launcher.SiteState.Busy)
                throw new InvalidOperationException("A porta " + Launcher.Port + " está em uso por outro aplicativo. Feche esse aplicativo e tente novamente.");

            string script = Path.Combine(Launcher.Root, "scripts", "launcher", "server.mjs");
            if (!File.Exists(Path.Combine(Launcher.Root, "package.json")) || !File.Exists(script))
                throw new InvalidOperationException("Mantenha este executável dentro da pasta althea-inner-quest, junto dos arquivos do projeto.");
            if (!File.Exists(Path.Combine(Launcher.Root, "node_modules", "vite", "package.json")))
                throw new InvalidOperationException("As dependências do projeto não foram encontradas. Execute npm install nesta pasta e abra o Althea novamente.");

            lock (lifecycleLock)
            {
                if (closing) return;
                job = new ProcessJob();
                server = new Process {
                    StartInfo = new ProcessStartInfo {
                        FileName = Launcher.FindNode(), Arguments = "\"" + script + "\"",
                        WorkingDirectory = Launcher.Root, UseShellExecute = false,
                        CreateNoWindow = true, WindowStyle = ProcessWindowStyle.Hidden,
                        RedirectStandardOutput = true, RedirectStandardError = true,
                        StandardOutputEncoding = Encoding.UTF8, StandardErrorEncoding = Encoding.UTF8
                    }, EnableRaisingEvents = true
                };
                server.StartInfo.EnvironmentVariables["ALTHEA_LAUNCHER_PORT"] = Launcher.Port.ToString();
                server.OutputDataReceived += delegate(object sender, DataReceivedEventArgs e) { if (e.Data != null) Launcher.Log(e.Data); };
                server.ErrorDataReceived += delegate(object sender, DataReceivedEventArgs e) { if (e.Data != null) Launcher.Log(e.Data); };
                server.Exited += delegate {
                    if (!closing && ready) OnUi(delegate { ShowFailure("O servidor do Althea foi encerrado. Abra o executável novamente para reiniciar."); });
                };
                server.Start();
                try { job.Add(server); }
                catch { if (!server.HasExited) server.Kill(); throw; }
                server.BeginOutputReadLine();
                server.BeginErrorReadLine();
                Launcher.Log("Servidor local iniciado. PID " + server.Id);
            }

            for (int attempt = 0; attempt < 200 && !closing; attempt++)
            {
                if (server.HasExited)
                    throw new InvalidOperationException("O servidor não conseguiu iniciar. Consulte o registro de inicialização para mais detalhes.");
                if (Launcher.Probe() == Launcher.SiteState.Ready)
                {
                    ready = true;
                    OnUi(delegate {
                        tray.Text = "Althea - clique duas vezes para abrir";
                        Launcher.Log("Site pronto em " + Launcher.SiteUrl);
                        if (openBrowser) TryOpen();
                    });
                    return;
                }
                Thread.Sleep(300);
            }
            if (!closing) throw new InvalidOperationException("O Althea demorou demais para iniciar. Consulte o registro de inicialização e tente novamente.");
        }
        catch (Exception exception)
        {
            Launcher.Log(exception.ToString());
            OnUi(delegate { ShowFailure(exception.Message); });
        }
    }

    private void TryOpen()
    {
        if (!ready) { tray.ShowBalloonTip(2500, "Althea", "O site está iniciando. O navegador será aberto quando estiver pronto.", ToolTipIcon.Info); return; }
        try { Launcher.OpenBrowser(); }
        catch (Exception exception)
        {
            Launcher.Log(exception.ToString());
            MessageBox.Show("Não foi possível abrir o navegador automaticamente. Acesse " + Launcher.SiteUrl, "Althea", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
    }

    private void ShowFailure(string message)
    {
        if (closing) return;
        Failed = true;
        MessageBox.Show(message + "\n\nRegistro: " + Launcher.LogPath, "Althea", MessageBoxButtons.OK, MessageBoxIcon.Error);
        ExitThread();
    }

    private void OnUi(Action action)
    {
        if (closing) return;
        try { dispatcher.BeginInvoke((MethodInvoker)delegate { if (!closing) action(); }); }
        catch (InvalidOperationException) { }
    }

    protected override void ExitThreadCore()
    {
        if (closing) return;
        closing = true;
        tray.Visible = false;
        // Closing the job terminates only the server and children created by this launcher.
        lock (lifecycleLock)
        {
            if (job != null) job.Dispose();
            if (server != null)
            {
                try { if (!server.HasExited) server.WaitForExit(2000); }
                catch (InvalidOperationException) { }
                server.Dispose();
            }
        }
        Launcher.Log("Iniciador encerrado.");
        base.ExitThreadCore();
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing && !disposed)
        {
            disposed = true;
            stopSignal.Set();
            stopSignal.Dispose();
            tray.ContextMenuStrip.Dispose();
            tray.Icon.Dispose();
            tray.Dispose();
            dispatcher.Dispose();
        }
        base.Dispose(disposing);
    }
}

// Keep Vite and its esbuild children attached to the launcher, including unexpected exits.
internal sealed class ProcessJob : IDisposable
{
    private IntPtr handle;
    internal ProcessJob()
    {
        handle = CreateJobObject(IntPtr.Zero, null);
        if (handle == IntPtr.Zero) throw new System.ComponentModel.Win32Exception();
        var limits = new ExtendedLimits();
        limits.Basic.LimitFlags = 0x2000; // JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        int size = Marshal.SizeOf(typeof(ExtendedLimits));
        IntPtr pointer = Marshal.AllocHGlobal(size);
        try
        {
            Marshal.StructureToPtr(limits, pointer, false);
            if (!SetInformationJobObject(handle, 9, pointer, (uint)size))
                throw new System.ComponentModel.Win32Exception();
        }
        catch { Dispose(); throw; }
        finally { Marshal.FreeHGlobal(pointer); }
    }
    internal void Add(Process process)
    {
        if (!AssignProcessToJobObject(handle, process.Handle)) throw new System.ComponentModel.Win32Exception();
    }
    public void Dispose()
    {
        if (handle != IntPtr.Zero) { CloseHandle(handle); handle = IntPtr.Zero; }
    }
    [StructLayout(LayoutKind.Sequential)] private struct BasicLimits {
        internal long PerProcessTime, PerJobTime;
        internal uint LimitFlags;
        internal UIntPtr MinWorkingSet, MaxWorkingSet;
        internal uint ActiveProcesses;
        internal UIntPtr Affinity;
        internal uint Priority, Scheduling;
    }
    [StructLayout(LayoutKind.Sequential)] private struct IoCounters {
        internal ulong ReadOps, WriteOps, OtherOps, ReadBytes, WriteBytes, OtherBytes;
    }
    [StructLayout(LayoutKind.Sequential)] private struct ExtendedLimits {
        internal BasicLimits Basic;
        internal IoCounters Io;
        internal UIntPtr ProcessMemory, JobMemory, PeakProcessMemory, PeakJobMemory;
    }
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)] private static extern IntPtr CreateJobObject(IntPtr attributes, string name);
    [DllImport("kernel32.dll", SetLastError = true)] private static extern bool SetInformationJobObject(IntPtr job, int informationClass, IntPtr information, uint length);
    [DllImport("kernel32.dll", SetLastError = true)] private static extern bool AssignProcessToJobObject(IntPtr job, IntPtr process);
    [DllImport("kernel32.dll", SetLastError = true)] private static extern bool CloseHandle(IntPtr handle);
}
