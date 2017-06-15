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

namespace WindowsServiceAgent
{
    public partial class SiemAgent : ServiceBase
    {
        Thread securityThread;
        Thread systemThread;
        Thread applicationThread;

        public SiemAgent()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            securityThread = new Thread(Library.readEventFile);
            securityThread.Start("Setup.evtx");
            //systemThread = new Thread(Library.readEventFile);
            //systemThread.Start("System.evtx");
            //applicationThread = new Thread(Library.readEventFile);
            //applicationThread.Start("Application.evtx");
            Library.writeLog("upalio se servissssssssssss", "LogFile.txt");
        }
        
        protected override void OnStop()
        {
            securityThread.Abort();
            //systemThread.Abort();
            //applicationThread.Abort();
            Library.writeLog("servis ugasennnnnnnnnnnnnnn", "LogFile.txt");
        }
    }
}
