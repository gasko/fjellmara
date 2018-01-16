#!/usr/bin/python

import pymysql
import csv
import json
from datetime import datetime

def checktime(time):
    if time in ("DNF", "DNS"):
        time = None
    return time

def checkstage(stage):
    if stage in ("50K", "22K"):
        return stage
    elif stage in ("Bydalen 50 km", "50km"):
        return "50K"
    elif stage in ("Bydalen 22 km", "22km"):
        return "22K"

def checkclass(xclass):
    return xclass


## Help function to print current row from CSV-file
def printRow(row):
    print("row[ ", end='')
    i=0
    for cell in row:
        print("cell["+str(j)+"] = \"" + cell + "\" ", end='')
        i += 1
    print(" ]")

## Transform to correct dateformat for storage in DB
def getCorrectDateFormat(s_date):
    if s_date in (None,"","-") :
        return None

    date_patterns = ['%d-%m-%Y', '%Y-%m-%d', '%d.%m.%Y','%y','%Y']
    for pattern in date_patterns:
        try:
            return datetime.strptime(s_date, pattern).strftime('%Y-%m-%d')
        except:
            pass

    print ("Date is not in expected format: [" + s_date +"]" )
    sys.exit(0)

def updateCheckpointsBydalen14(conn, results_id, checkpoint, time, distance) :
            if time in (None,"","-") :
                return
            if time == "IT" :
                time = None

            c = conn.cursor()
            sql = '''INSERT INTO checkpoints (results_id, name,timepassed, distance)
                     VALUES (%s,%s,%s,%s)'''
            params = (results_id, checkpoint, time, distance)

            try:
                c.execute(sql , params)

            except pymysql.err.InternalError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

            except pymysql.err.IntegrityError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)
            conn.commit()

## Collect DATA from the bydale2014 csv
def collectFromBydalen14Csv(conn, csvfile, race, year, stage, gender, xclass):
    c = conn.cursor()
    with open(csvfile, newline='', encoding='utf-8') as mcsvfile :
        reader = csv.reader(mcsvfile, delimiter=';', dialect="excel")
        i = 0;
        next(reader)
        next(reader)
        next(reader)
        for row in reader:
            if row[4] in (None,"","-") :
                birthdate = None
            else :
                if int(row[4]) > 10 :
                    date="19"+str(row[4])
                else:
                    date="20"+str(row[4])

                birthdate = getCorrectDateFormat(date)

            time = row[6]
            bib = row[1]

            if row[0] in ("DNS", "DNF"):
                status = row[0]
            else :
                status = "TIME"

            sql = '''INSERT INTO results (race, year, bib, firstname, surname, gender, birthdate, club, class, stage, status, time)
                             VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            params = (race, year, bib, row[2], row[3], gender, birthdate, row[5], xclass, stage, status, time)
            try:
                c.execute(sql , params)

            except pymysql.err.InternalError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

            except pymysql.err.IntegrityError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

            sql = ''' SELECT id
                        FROM results
                        WHERE bib = %s AND race = %s AND year = %s'''
            params = (bib, race, year)
            c.execute(sql,params);
            res = c.fetchone()
            if res == None :
                print(res)
                print(str(bib) + " " + race + " " + str(year))
            results_id = res['id']

            updateCheckpointsBydalen14(conn, results_id, "Mårdsundsbodarna", row[7], 10500)
            if len(row)>8:
                updateCheckpointsBydalen14(conn, results_id, "Mål", row[6], 49000)
                updateCheckpointsBydalen14(conn, results_id, "Bydalen", row[8], 22500)
                updateCheckpointsBydalen14(conn, results_id, "Drombacken", row[9], 30000)
                updateCheckpointsBydalen14(conn, results_id, "Falkfångarfjället", row[10], 40000)
            else :
                updateCheckpointsBydalen14(conn, results_id, "Mål", row[6], 22000)
    conn.commit()

## Collect DATA from the *_resultat.csv
def collectFromResultatCsv(conn, csvfile, race, year):
    c = conn.cursor()
    with open(csvfile, newline='', encoding='utf-8') as mcsvfile :
        reader = csv.reader(mcsvfile, delimiter=';', dialect="excel")
        i = 0;
        next(reader)
        for row in reader:
            birthdate = getCorrectDateFormat(row[5])
            time = checktime(row[18])
            stage = checkstage(row[14])
            if row[14] == "Kvartsmaraton" :
                race = "Kvartsmaraton"
            xclass= checkclass(row[12])
            sql = '''INSERT INTO results (race, year, bib, firstname, surname, gender, birthdate, city, nation, club, class, stage, status, time)
                             VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            params = (race, year, row[0], row[1], row[2], row[4], birthdate, row[6], row[7], row[10], xclass, stage, row[16], time)
            try:
                c.execute(sql , params)

            except pymysql.err.InternalError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

            except pymysql.err.IntegrityError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

    conn.commit()

## Collect DATA from the *_mellantider.csv
def collectFromCheckpointsCsv(conn, csvfile, race, year):
    c = conn.cursor()
    with open(csvfile, newline='', encoding='utf-8') as csvfile :
        reader = csv.reader(csvfile, delimiter=';', dialect="excel")
        i = 0;
        next(reader)
        for row in reader:
            if row[0]=="Kvartsmaraton":
                race="Kvartsmaraton"
            bib = row[2]
            email = row[7]
            location = row[9]
            timeofday = row[13]
            time = row[14]
            distance = row[10]
            starttime = row[12]

            c = conn.cursor()

            sql = ''' SELECT id, email
                        FROM results
                        WHERE bib = %s AND race = %s AND year = %s'''
            params = (bib, race, year)
            c.execute(sql,params);
            res = c.fetchone()
            if res == None :
                print(res)
                print(str(bib) + " " + race + " " + str(year) + "["+ str(row[3]) + " " + str(row[4]) + "]")
                continue
            _id = res['id']
            res_email = res['email']

            if res_email == None:
                sql = ''' UPDATE results
                            SET email = %s
                            WHERE bib = %s AND race = %s AND year = %s'''
                params = (email, bib, race, year)
                c.execute(sql,params);
            elif res_email != email :
                print("WARNING db and csv email don't match ["+res_email+"] != ["+email+"]")

            sql = ''' SELECT id
                        FROM checkpoints
                        WHERE results_id = %s AND name = %s'''
            params = (_id, "start")
            c.execute(sql,params);
            res = c.fetchone()
            #print(res)
            if res==None:
                sql = '''INSERT INTO checkpoints (results_id, name, timeofday, timepassed, distance)
                        VALUES (%s,%s,%s,%s,%s)'''
                params = (_id, "start", starttime, "00:00:00", 0)
                try:
                    c.execute(sql , params)

                except pymysql.err.InternalError as e:
                    code, msg = e.args
                    print('WARNING ' +str(code) + ': ' + msg)

                except pymysql.err.IntegrityError as e:
                    code, msg = e.args
                    print('WARNING ' +str(code) + ': ' + msg)

            timetemp = time.split(":")
            timetempsum = int(timetemp[0])*60*60 + int(timetemp[1])*60 + int(timetemp[2])

            if location == "Mål" and timetempsum <= 59:
                continue;

            ##   For every checkpoint that will be passed under one hour
            if race == "Copper Trail" and int(timetemp[0]) > 10 :
                time = "00:" + timetemp[0] + ":" + timetemp[1]

            sql = '''INSERT INTO checkpoints (results_id, name, timeofday, timepassed, distance)
                     VALUES (%s,%s,%s,%s,%s)'''
            params = (_id, location, timeofday, time, distance)

            try:
                c.execute(sql , params)

            except pymysql.err.InternalError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

            except pymysql.err.IntegrityError as e:
                code, msg = e.args
                print('WARNING ' +str(code) + ': ' + msg)

        conn.commit()



if __name__ == '__main__':
    conn = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='fjelldata',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)



    ##############################################
    ##                                          ##
    ##  Bydalen                                 ##
    ##                                          ##
    ##############################################
    if 1 :
        race = 'Bydalen Fjällmaraton'

        #Results Bydalen 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/Bydalen/Bydalen_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Bydalen/Bydalen_2017_mellantider.csv', race, year)

        #Results Bydalen 2016
        year=2016
        collectFromResultatCsv(conn, 'csv/Bydalen/Bydalen_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Bydalen/Bydalen_2016_mellantider.csv', race, year)

        #Results Bydalen 2015
        year=2015
        collectFromResultatCsv(conn, 'csv/Bydalen/Bydalen_2015_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Bydalen/Bydalen_2015_mellantider.csv', race, year)

        #Results Bydalen 2014
        year=2014
        #Herrar
        x_gender="M"
        x_class="Män"
        #22K
        x_stage="22K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_22km_herrar1.csv', race, year, x_stage, x_gender, x_class)
        #50K
        x_stage="50K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_50km_herrar5.csv', race, year, x_stage, x_gender, x_class)
        #Damer
        x_gender="F"
        x_class="Kvinnor"
        #22K
        x_stage="22K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_22km_damer2.csv', race, year, x_stage, x_gender, x_class)
        #50K
        x_stage="50K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_50km_damer3.csv', race, year, x_stage, x_gender, x_class)

    ##############################################
    ##                                          ##
    ##  27K                                     ##
    ##                                          ##
    ##############################################

    if 1 :
        race = '27k'

        #Results 27K 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/27K/27K_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/27K/27K_2017_mellantider.csv', race, year)

        #Results 27K 2016
        year=2016
        collectFromResultatCsv(conn, 'csv/27K/27K_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/27K/27K_2016_mellantider.csv', race, year)

    ##############################################
    ##                                          ##
    ##  Fjällmaraton                            ##
    ##                                          ##
    ##############################################

    if 1 :
        race = 'Fjällmaraton'

        #Results Fjällmaraton 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2017_mellantider.csv', race, year)

        #Results Fjällmaraton 2016
        year=2016
        collectFromResultatCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2016_mellantider.csv', race, year)

        #Results Fjällmaraton 2015
        year=2015
        collectFromResultatCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2015_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2015_mellantider.csv', race, year)

    if 1 :
        race = 'Copper Trail'

        #Results Copper Trail 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/CopperTrail/CopperTrail_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/CopperTrail/CopperTrail_2017_mellantider.csv', race, year)

    conn.close()
