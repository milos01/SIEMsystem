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

import Crypto
from Crypto.PublicKey import RSA
from Crypto import Random
from Crypto.Hash import SHA256
import platform

import pickle
import json

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
                    jsonData = {}

                    date = line.split(socket.gethostname())[0]
                    logType = "Info"
                    message = line.split(socket.gethostname())[1]
                    
                    text = str(date) + str(logType) + str(message) + str(platform.system())
                    jsonData = {'Date':date,'System':platform.system(),'Type':logType,'Message':message,'ComputerName':socket.gethostname()}
                    hash_of_agent_message = SHA256.new(text).digest()
                    signature_agent       = keypair_agent.sign(hash_of_agent_message, '')
                    
                    jsonData['Signature'] = "".join(map(str,signature_agent))
                  
                    print json.dumps(jsonData)

                    try:
                        r = requests.post(URL, data=json.dumps(jsonData),headers = {'Content-Type': 'application/json'})
                        print r.status_code
                    except ConnectionError as e:
                        print e
                        
                 #   print line
            
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
                    
                    jsonData = {}
                    
                    if "WARNING" in line:
                        logType = "WARNING"
                    elif "CRITICAL" in line:
                        logType = "CRITICAL"
                    elif "ERROR" in line or "Error" in line:
                        logType = "ERROR"
                    else:
                        logType = "INFO"
                        
                    message = line.split(socket.gethostname())[1]
                    date = line.split(socket.gethostname())[0]
                   
                    text = str(date) + str(logType) + str(message) + str(platform.system())
                    jsonData = {'Date':date,'System':platform.system(),'Type':logType,'Message':message,'ComputerName':socket.gethostname()}
                    hash_of_agent_message = SHA256.new(text).digest()
                    signature_agent       = keypair_agent.sign(hash_of_agent_message, '')
                    
                    jsonData['Signature'] = "".join(map(str,signature_agent))
                  
                    print json.dumps(jsonData)
                    
                    try:
                        r = requests.post(URL, data=json.dumps(jsonData),headers = {'Content-Type': 'application/json'})
                    except ConnectionError as e:
                        print e
                        
              
                    
                #    print line
                
                print "*********************************************"
                currTimeSYS = prevTimeSYS
                time.sleep(20)

                
            
     
if __name__=="__main__":
    currTimeMAuth = os.stat("/var/log/auth.log").st_mtime
    currTimeSYS = os.stat("/var/log/syslog").st_mtime
    
    # Use a larger key length in practice...
    KEY_LENGTH = 1024  # Key size (in bits)
    random_gen = Random.new().read
    
    if os.stat("pubkey").st_size == 0:
        
        random_gen = Random.new().read
        
        # Generate RSA private/public key pairs for both parties...
        keypair_agent = RSA.generate(KEY_LENGTH, random_gen)
        pubkey_agent  = keypair_agent.publickey()
        
        with open('pubkey', 'wb') as output:
            
            pickle.dump(pubkey_agent, output, pickle.HIGHEST_PROTOCOL)
            
        with open('privatekey','wb') as output:
            pickle.dump(keypair_agent, output, pickle.HIGHEST_PROTOCOL)
    else:
        print "NE"
        with open('privatekey', 'rb') as input:
            keypair_agent = pickle.load(input)
            
        with open('pubkey', 'rb') as input:
            pubkey_agent = pickle.load(input)
            
    readLogs(currTimeMAuth,currTimeSYS)
   
    """
    text = "aaaaaasadasdadada"
    hash_of_agent_message = SHA256.new(text).digest()
    print hash_of_agent_message
    signature_agent       = keypair_agent.sign(hash_of_agent_message, '')
    print hash_of_agent_message
    print signature_agent

    
    text = "aaaaa"
    desifrovanHESH = SHA256.new(text).digest()
    
    if pubkey_agent.verify(desifrovanHESH, signature_agent):
        print "Poruka ka SIEM:"
        print "Nema izmene"
        print ""
    else:
        print "Promenjen dok"
    """

