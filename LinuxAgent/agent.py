# -*- coding: utf-8 -*-
"""
Created on Thu Jun  8 22:48:09 2017

@author: mladen
"""
import os
import socket
import time
import requests
from requests.exceptions import ConnectionError

def readLogs(currTimeAuth,currTimeSYS):
    
    URL = "http://localhost:8080/sisa/primiga"   
    
    # AUTH.log file read
    fnameAuth  = "/var/log/auth.log"
    with open(fnameAuth) as f:
        cont = f.readlines()
    
    cont = [x.strip() for x in cont]
    lastLineAuth = cont[-1]
    
    
    #SYSLOGS file read
    fnameSYS  = "/var/log/syslog"
    with open(fnameSYS) as f:
        contSYS = f.readlines()
    
    contSYS = [x.strip() for x in contSYS]
    lastLineSYS = contSYS[-1]
   
    
    while True:
        
        prevTimeAuth = os.stat("/var/log/auth.log").st_mtime
        prevTimeSYS = os.stat("/var/log/syslog").st_mtime
       # prev = currTimeM
        if currTimeAuth==prevTimeAuth and currTimeSYS==prevTimeSYS:
            
            print "________________FAJLOVI NISU MENJANI______________"
            print "___________________SPAVAM 10SEC___________________"
            time.sleep(20)
        else:
            if currTimeAuth!=prevTimeAuth:
                #Menjan auth fajl
                with open(fnameAuth) as f:
                    cont = f.readlines()
                cont = [x.strip() for x in cont]
                
                lastLineAuthIndex = cont.index(lastLineAuth)
                
                lastLineAuth = cont[-1] #Poslenji poslat log iz AUTH
             #   jsonAuth = "["
                print "_______SALJEM AUTH NA SERVER__________"
                for line in cont[lastLineAuthIndex+1:]:
                    text = ""

                    date = line.split(socket.gethostname())[0]
                    logType = "Info"
                    message = line.split(socket.gethostname())[1]
                    
                    text = "Date of log:" + date +"; Log type:"+logType + "; Log message:" + message
                    
                    payload = {"text":text}
                    
                    try:
                        r = requests.post(URL, data=payload)
                    except ConnectionError as e:
                        print e
                        
                   # print r.status_code
              #      print count
               #     jsonAuth = jsonAuth + "{date:" + line.split("mladen-Lenovo-G580")[0]+","+"/n"
                #    +"message:"+line.split("mladen-Lenovo-G580")[1] + "},"
                    print line
                #jsonAuth = jsonAuth + "]"  
                print "*********************************************"
                currTimeAuth = prevTimeAuth
                time.sleep(20)
            else:
                #Menjan sistemski fajl
                with open(fnameSYS) as f:
                    contSYS = f.readlines()
                contSYS = [x.strip() for x in contSYS]
                
                lastLineSYSIndex = contSYS.index(lastLineSYS)
                
                lastLineSYS = contSYS[-1]  #Poslednji poslat log iz SYS
               
                print "_______SALJEM SYS NA SERVER__________"
                for line in contSYS[lastLineSYSIndex+1:]:
                    
                    text = ""

                    date = line.split(socket.gethostname())[0]
                    if "WARNING" in line:
                        logType = "WARNING"
                    elif "CRITICAL" in line:
                        logType = "CRITICAL"
                    elif "ERROR" in line or "Error" in line:
                        logType = "ERROR"
                    else:
                        logType = "INFO"
                        
                    message = line.split(socket.gethostname())[1]
                    
                    text = "Date of log:" + date +"; Log type:"+logType + "; Log message:" + message
                    
                    payload = {"text":text}
                    
                    try:
                        r = requests.post(URL, data=payload)
                    except ConnectionError as e:
                        print e
                        
                  #  print r.status_code
                    
                    print line
                
                print "*********************************************"
                currTimeSYS = prevTimeSYS
                time.sleep(20)

                
            
     
if __name__=="__main__":
    currTimeMAuth = os.stat("/var/log/auth.log").st_mtime
    currTimeSYS = os.stat("/var/log/syslog").st_mtime
    readLogs(currTimeMAuth,currTimeSYS)
    #print socket.gethostname()


