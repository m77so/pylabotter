# -*- coding: utf-8 -*-
from urllib.parse import urlparse
import sqlite3
import configparser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
from datetime import datetime
from requests_oauthlib import OAuth1Session
import sys

class LaboHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path).path
        l = []
        if parsed_path == "/data":
            c.execute("select * from data order by ROWID desc")
            l = c.fetchall()       
            
        elif parsed_path == "/push":
            c.execute("select ROWID,* from data order by ROWID desc limit 1")
            l = c.fetchall()
            nowtime = datetime.now().isoformat(" ", "seconds")
            if len(l) > 0 and l[0][2] == None:
                c.execute("update data set end='{0}' where ROWID=={1}".format(
                    nowtime, l[0][0]))                
                if twiflag:
                    params = {"status": "りだ {0} 経過時間 {1}".format(nowtime,(datetime.now()-datetime.strptime(l[0][1],"%Y-%m-%d %H:%M:%S")))}
                    req = twitter.post(twurl, params=params)
            else:
                c.execute(
                       "insert into data(start) values('{0}') ".format(nowtime))
                if twiflag:
                    params = {"status": "いん {0}".format(nowtime)}
                    req = twitter.post(twurl, params=params)
            conn.commit()
            c.execute("select * from data order by ROWID desc")
            l = c.fetchall()
        else:
            super().do_GET()
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write((json.dumps(l)).encode("utf-8"))



dbname = 'database.db'
config = configparser.SafeConfigParser()
config.read("config.conf")
twiflag = False
try:
    CK = config.get("twitter", "CK")
    CS = config.get("twitter", "CS")
    AT = config.get("twitter", "AT")
    AS = config.get("twitter", "AS")
    twitter = OAuth1Session(CK, CS, AT, AS)
    twiflag = True
except configparser.NoSectionError:
    print("No Twitter Section")
except configparser.NoOptionError:
    print("No Option Error inside of twitrer section")
except:
    print("Unexepcted eror", sys.exc_info()[0])

twurl = "https://api.twitter.com/1.1/statuses/update.json"

conn = sqlite3.connect(dbname)
c = conn.cursor()
create_table = '''create table if not exists data (start text, end text)'''
c.execute(create_table)
server = HTTPServer(('localhost', 8080), LaboHandler)
server.serve_forever()
