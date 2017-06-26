using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsServiceAgent
{
    public class LogFileInfo
    {
        public int id { get; set; }

        public string fileName { get; set; }

        public string fileLocation { get; set; }

        public DateTime lastLog { get; set; }

        public LogFileInfo() { }

        public LogFileInfo(int id, string fileName, string fileLocation, DateTime lastLog)
        {
            this.id = id;
            this.fileName = fileName;
            this.fileLocation = fileLocation;
            this.lastLog = lastLog;
        }
    }
}
