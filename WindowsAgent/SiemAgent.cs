using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Security.Cryptography;
using Org.BouncyCastle.Crypto;

namespace WindowsServiceAgent
{
    public partial class SiemAgent : ServiceBase
    {
        Thread securityThread;
        Thread systemThread;
        Thread applicationThread;
        List<Thread> windowsThreads;

        public SiemAgent()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            RSACryptoServiceProvider RSA = new RSACryptoServiceProvider(2048);
            //string publicKey = RSA.ToXmlString(false);
            //string privateKey = RSA.ToXmlString(true);
            AsymmetricCipherKeyPair keyPair = Library.readPrivateKey();
            windowsThreads = new List<Thread>();
            //List<LogFileInfo> logFiles = Library.readLastWrittenLogs(); 
            List<string> logFiles = Library.readConfigFile();
            foreach (string l in logFiles)
            {
                Library.writeLog(l, "log.txt");
                ThreadStart starter = delegate { Library.readEventFile(l, keyPair, DateTime.Now); };
                windowsThreads.Add(new Thread(starter));
            }
            foreach(Thread t in windowsThreads)
            {
                t.Start();
            }
            //securityThread = new Thread(Library.readEventFile);
            //securityThread.Start("Setup.evtx");
            //systemThread = new Thread(Library.readEventFile);
            //systemThread.Start("System.evtx");
            //applicationThread = new Thread(Library.readEventFile);
            //applicationThread.Start("Application.evtx");
            Library.writeLog("upalio se servisssssssssssseqweqweqwewqeqw", "LogFile.txt");
        }
        
        protected override void OnStop()
        {
            foreach (Thread t in windowsThreads)
            {
                t.Abort();
            }
            //securityThread.Abort();
            //systemThread.Abort();
            //applicationThread.Abort();
            Library.writeLog("servis ugasennnnnnnnnnnnnnn", "LogFile.txt");
        }
    }
}
