using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Diagnostics.Eventing.Reader;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading;
using System.Net.Http;
using System.Security.Cryptography;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Security;

namespace WindowsServiceAgent
{
    public static class Library
    {

        public static List<LogFileInfo> listOfLogInfos;
        private static readonly HttpClient client = new HttpClient();
        private static int eventNumber = 0;

        public static void writeLog(string log, string fileName)
        {
            StreamWriter sw = null;
            //AppDomain.CurrentDomain.BaseDirectory
            sw = new StreamWriter(GetExecutingDirectoryName() + "\\" + fileName, true);
            sw.WriteLine(log);
            sw.Flush();
            sw.Close();
        }

        public static string GetExecutingDirectoryName()
        {
            //var location = new Uri(Assembly.GetEntryAssembly().GetName().CodeBase);
            //return new FileInfo(location.AbsolutePath).Directory.FullName;
            var assemblyPath = new Uri(Assembly.GetExecutingAssembly().CodeBase).LocalPath;
            string directoryPath = Path.GetDirectoryName(assemblyPath);
            return directoryPath;
        }

        public static void writeLastReadLogs(string line)
        {

        }

        public static List<LogFileInfo> readLastWrittenLogs()
        {
            listOfLogInfos = new List<LogFileInfo>();
            if (File.Exists(GetExecutingDirectoryName() + "\\logFilesTimes.txt"))
            {
                var lines = File.ReadLines(GetExecutingDirectoryName() + "\\logFilesTimes.txt");
                int lineIndex = 0;
                foreach (var line in lines)
                {
                    lineIndex += 1;
                    string[] logDetails = line.Split(',');
                    LogFileInfo log = new LogFileInfo(lineIndex, logDetails[1], logDetails[2], DateTime.ParseExact(logDetails[0], "MM/dd/yyyy HH:mm:ss tt", null));
                    listOfLogInfos.Add(log);
                }
            }
            return listOfLogInfos;
        }

        public static List<string> readConfigFile()
        {
            string configFile = GetExecutingDirectoryName() + "\\config.txt";
            List<string> logFiles = new List<string>();
            if(File.Exists(configFile))
            {
                var lines = File.ReadLines(configFile);
                foreach(var line in lines)
                {
                    string[] logs = line.Split(',');
                    for(int i = 1; i< logs.Length; i++)
                    {
                        logFiles.Add(logs[0] + logs[i]);
                    }
                }
            }
            return logFiles;
        }

        public static AsymmetricCipherKeyPair readPrivateKey()
        {
            AsymmetricCipherKeyPair keyPair;

            using (var reader = File.OpenText(WindowsServiceAgent.Library.GetExecutingDirectoryName() + "\\privateKey.pem")) // file containing RSA PKCS1 private key
                keyPair = (AsymmetricCipherKeyPair)new PemReader(reader).ReadObject();
            return keyPair;
            /*
            string privateKeyFile = GetExecutingDirectoryName() + "\\privateKey.txt";
            string privateKey=File.ReadAllText(privateKeyFile);
            RSACryptoServiceProvider r = new RSACryptoServiceProvider(2048);
            r.FromXmlString(privateKey);
            return r.ToXmlString(true);
            */
        }

        private static string signMessage(string message, AsymmetricCipherKeyPair keyPair)
        {
            var encoder = new UTF8Encoding();
            var inputData = encoder.GetBytes(message);

            var signer = SignerUtilities.GetSigner("SHA256WITHRSA");
            signer.Init(true, keyPair.Private);
            signer.BlockUpdate(inputData, 0, inputData.Length);

            var sign = signer.GenerateSignature();
            var signmsg = Convert.ToBase64String(sign);
            /*
            try
            {
                RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(2048);
                //Initiate a new instanse with 2048 bit key size

                rsa.FromXmlString(publicKey);
                // Load private key
                writeLog(rsa.)
                signedMessage = Convert.ToBase64String(rsa.SignData(Encoding.UTF8.GetBytes(message), CryptoConfig.MapNameToOID("SHA256")));
                writeLog(Encoding.UTF8.GetString(rsa.Decrypt(Encoding.UTF8.GetBytes(signedMessage), false)), "hashed.txt");
                //rsa.SignData( buffer, hash algorithm) - For signed data. Here I used SHA512 for hash. 
                //Encoding.UTF8.GetBytes(string) - convert string to byte messafe 
                //Convert.ToBase64String(string) - convert back to a string.
            }
            catch (Exception)
            {
                signedMessage = string.Empty;
                writeLog("qweqeqwe", "nevalja.txt");
            }
            */

            return signmsg;
        }

        public static async Task sendRequest(Dictionary<string, string> values)
        {
            if (client.BaseAddress == null)
            {
                client.BaseAddress = new Uri("http://localhost:8080/");
            }
            client.DefaultRequestHeaders
                  .Accept
                  .Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "api/event");
            request.Content = new StringContent(JsonConvert.SerializeObject(values),
                                                Encoding.UTF8,
                                                "application/json");//CONTENT-TYPE header
            //writeLog(request.Content.ReadAsStringAsync().Result, "request.txt");
            client.SendAsync(request);
            //var content = new FormUrlEncodedContent(values);
            //var response = await client.PostAsync()

            //var responseString = await response.Content.ReadAsStringAsync();
        }

        public static void readEventFile(string fileName, AsymmetricCipherKeyPair keyPair, DateTime now)
        {
            //string signatureData = "6/27/2017 4:11:09 AM" + "Information" + "The Siem Agent service entered the running state." + "Windows";
            //string signedMessage = signMessage(signatureData, privateKey);

            
            string systemDirectory = Path.GetPathRoot(Environment.SystemDirectory);
            string filePath = systemDirectory + fileName;
            DateTime lastModified = File.GetLastWriteTime(filePath);
            EventBookmark book = null;
            using (var reader = new System.Diagnostics.Eventing.Reader.EventLogReader(filePath, PathType.FilePath))
            {
                EventRecord record;
                while ((record = reader.ReadEvent()) != null)
                {
                    book = record.Bookmark;

                    if (DateTime.Compare(record.TimeCreated.GetValueOrDefault(new DateTime(1, 1, 1, 1, 1, 1)), now) > 0)
                    {
                        //httprequest
                        if(eventNumber == 8000)
                        {
                            eventNumber = 1;
                        }
                        else
                        {
                            eventNumber += 1;
                        }
                        string signatureData = record.TimeCreated.ToString() + record.LevelDisplayName + record.FormatDescription() + "Windows" + eventNumber.ToString();
                        string signedMessage = signMessage(signatureData, keyPair);
                        //values.ToString();
                        var values = new Dictionary<string, string>
                        {
                            { "ComputerName", record.MachineName },
                            { "System", "Windows" },
                            { "Date", record.TimeCreated.ToString()},
                            { "Message", record.FormatDescription()},
                            { "Type", record.LevelDisplayName},
                            { "Signature", signedMessage},
                            { "LogNumber", eventNumber.ToString()}
                        };
                        sendRequest(values);

                    }
                    
                    //string eventData = record.TimeCreated + record.LevelDisplayName + ":" + record.FormatDescription();
                    //writeLog(eventData, "Setup.txt");
                    //Console.WriteLine("{0} {1}: {2}", record.TimeCreated, record.LevelDisplayName, record.FormatDescription()); @"Windows\System32\winevt\Logs\"
                }
            }
            while (true)
            {
                using (var reader = new System.Diagnostics.Eventing.Reader.EventLogReader(filePath, PathType.FilePath))
                {
                    reader.Seek(book, 1);
                    EventRecord record;
                    while ((record = reader.ReadEvent()) != null)
                    {
                        book = record.Bookmark;
                        writeLog(record.TimeCreated.ToString() + " " + record.LogName, "logwwqw.txt");
                        if (eventNumber == 8000)
                        {
                            eventNumber = 1;
                        }
                        else
                        {
                            eventNumber += 1;
                        }
                        string signatureData = record.TimeCreated.ToString() + record.LevelDisplayName + record.FormatDescription() + "Windows" + eventNumber.ToString();
                        string signedMessage = signMessage(signatureData, keyPair);
                        //values.ToString();
                        var values = new Dictionary<string, string>
                        {
                            { "ComputerName", record.MachineName },
                            { "System", "Windows" },
                            { "Date", record.TimeCreated.ToString()},
                            { "Message", record.FormatDescription()},
                            { "Type", record.LevelDisplayName},
                            { "Signature", signedMessage},
                            { "LogNumber", eventNumber.ToString()}
                        };
                        writeLog(signedMessage, "signqe.txt");
                        sendRequest(values);
                    }

                }
                Thread.Sleep(10000);
            }
            
        }

    }
}
