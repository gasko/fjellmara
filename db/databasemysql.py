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
    if stage in ("50K", "Bydalen 50 km", "50km"):
        return "50K"
    elif stage in ("22K", "Bydalen 22 km", "22km"):
        return "22K"

def checkclass(xclass):
    return xclass


def checklocation(race, location):
    if race in ("Fjällmaraton", "Öppet Fjäll"):
        if location in ("Start Reg","Start Reg.", "Start reg", "StartVålådalen", "Start Vålådalen", "Start Våladalen"):
            return ["start", 0]
        elif location in ("Ottfjället"):
            return ["Ottfjället", 1]
        elif location in ("Nordbottnen"):
            return ["Nordbottnen", 2]
        elif location in ("Hållfjället"):
            return ["Hållfjället", 3]
        elif location in ("Ottsjö", "Ottsjön", "Ottsjöbua"):
            return ["Ottsjö", 4]
        elif location in ("Välliste"):
            return ["Välliste", 5]
        elif location in ("Pre. mål", "Pre. Mål", "Pre.Mål"):
            return ["pre finnish", 6]
        elif  location in ("Mål"):
            return ["finnish", 7]
        elif location in ("Grofjället"):
            return ["Grofjället", 10]

    if race == "27k":
        if location in ("start"):
            return ["start", 0]
        elif location in ("Hållfjället"):
            return ["Hållfjället", 1]
        elif location in ("Grofjället"):
            return ["Grofjället", 2]
        elif location in ("Välliste"):
            return ["Välliste", 3]
        elif location in ("Pre. mål", "Pre. Mål", "Pre.Mål"):
            return ["pre finnish", 4]
        elif  location in ("Mål"):
            return ["finnish", 5]

    if race == "Välliste Runt":
        if location in ("start"):
            return ["start", 0]
        elif location in ("Välliste"):
            return ["Välliste", 1]
        elif location in ("Pre. mål", "Pre. Mål", "Pre.Mål"):
            return ["pre finnish", 2]
        elif  location in ("Mål"):
            return ["finnish", 3]

    if race == "Vertical K":
        if location in ("start"):
            return ["start", 0]
        elif location in ("250M", "250M K"):
            return ["250M", 1]
        elif location in ("500M", "Mål 500M K"):
            return ["500M", 2]
        elif  location in ("750M"):
            return ["750M", 3]
        elif  location in ("Mål 1000M","Mål"):
            return ["finnish", 4]

    if race == "Copper Trail":
        if location in ("start"):
            return ["start", 0]
        elif location in ("Vändning"):
            return ["Vändning", 1]
        elif location in ("Pre. mål", "Pre. Mål", "Pre.Mål"):
            return ["pre finnish", 2]
        elif  location in ("Mål"):
            return ["finnish", 3]

    if race == "Kvartsmaraton":
        if location in ("start", "Start reg"):
            return ["start", 0]
        elif location in ("Välliste"):
            return ["Välliste", 1]
        elif location in ("Pre. mål", "Pre. Mål", "Pre.Mål"):
            return ["pre finnish", 2]
        elif  location in ("Mål"):
            return ["finnish", 3]

    if race == "Bydalen Fjällmaraton":
        if location in ("start", "Start reg"):
            return ["start", 0]
        elif location in ("Mårdsundsbodarna", "Mårdsundsbodarna "):
            return ["Mårdsundsbodarna", 1]
        elif location in ("Mårdsundsbodarna"):
            return ["Mårdsundsbodarna",2]
        elif location in ("Bydalen"):
            return ["Bydalen", 3]
        elif location in ("Drombacken","Höglekardalen"):
            return ["Drombacken", 4]
        elif location in ("Falkfångarfjället"):
            return ["Falkfångarfjället", 5]
        elif location in ("Förvarning"):
            return ["pre finnish", 6]
        elif  location in ("Mål"):
            return ["finnish", 7]

    # if race == "Bydalen Fjällmaraton 22K":
    #     if location in ("start", "Start reg"):
    #         return ["start", 0]
    #     elif location in ("Mårdsundsbodarna", "Mårdsundsbodarna "):
    #         return ["Mårdsundsbodarna", 1]
    #     elif location in ("Mårdsundsbodarna"):
    #         return ["Mårdsundsbodarna",2]
    #     elif location in ("Bydalen"):
    #         return ["Bydalen", 3]
    #     elif location in ("Förvarning"):
    #         return ["pre finnish", 4]
    #     elif  location in ("Mål"):
    #         return ["finnish", 5]

    if race == "Halvmaraton":
        return [location,-1]

    print("ERROR couldn't find checkpoint for [" + race + "-" + location + "]")
    sys.exit(0)





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

def updateCheckpointsBydalen14(conn, race, results_id, checkpoint, time, distance) :
            if time in (None,"","-") :
                return
            if time == "IT" :
                time = None

            location = checklocation(race, checkpoint)[0]
            location_order = checklocation(race, checkpoint)[1]

            c = conn.cursor()
            sql = '''INSERT INTO checkpoints (results_id, name, timepassed, distance, location_order)
                     VALUES (%s,%s,%s,%s,%s)'''
            params = (results_id, location, time, distance, location_order)

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

            updateCheckpointsBydalen14(conn, race, results_id, "Mårdsundsbodarna", row[7], 10500)
            if len(row)>8:
                updateCheckpointsBydalen14(conn, race, results_id, "Mål", row[6], 49000)
                updateCheckpointsBydalen14(conn, race, results_id, "Bydalen", row[8], 22500)
                updateCheckpointsBydalen14(conn, race, results_id, "Drombacken", row[9], 30000)
                updateCheckpointsBydalen14(conn, race, results_id, "Falkfångarfjället", row[10], 40000)
            else :
                updateCheckpointsBydalen14(conn, race, results_id, "Mål", row[6], 22000)
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
            elif  row[14] == "Halvmaraton" :
                race = "Halvmaraton"
            elif row[14]=="Öppet fjäll":
                        race="Öppet Fjäll"

            xclass = checkclass(row[12])

            # if race in ("Bydalen Fjällmaraton", "Bydalen Fjällmaraton 22K", "Bydalen Fjällmaraton 50K"):
            #     if stage == "50K":
            #         race = "Bydalen Fjällmaraton 50K"
            #     elif stage == "22K":
            #         race = "Bydalen Fjällmaraton 22K"

            sql = '''INSERT INTO results (race, year, bib, firstname, surname, gender, birthdate, city, nation, club, class, stage, status, time)
                             VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            params = (race, year, row[0], row[1], row[2], row[4], birthdate, row[6], row[7], row[10], xclass, stage, row[16], time)
            try:
                c.execute(sql , params)

            except pymysql.err.InternalError as e:
                code, msg = e.args
                ##print('WARNING ' +str(code) + ': ' + msg)

            except pymysql.err.IntegrityError as e:
                code, msg = e.args
                ##print('WARNING ' +str(code) + ': ' + msg)

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
            elif row[0]=="Halvmaraton":
                race="Halvmaraton"
            elif row[0]=="Öppet fjäll":
                race="Öppet Fjäll"

            # xxrace = race
            # if race in ("Bydalen Fjällmaraton", "Bydalen Fjällmaraton 22K", "Bydalen Fjällmaraton 50K"):
            #     if int(row[1]) == 50000:
            #         race = "Bydalen Fjällmaraton 50K"
            #     else :
            #         race = "Bydalen Fjällmaraton 22K"
            # xxxrace = race
            bib = row[2]
            email = row[7]
            location = checklocation(race, row[9])[0]
            location_order = checklocation(race, row[9])[1]
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
                print("Can't find parent in Results")
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

            sql = ''' SELECT id, fakeflag
                        FROM checkpoints
                        WHERE results_id = %s AND name = %s'''
            params = (_id, "start")
            c.execute(sql,params);
            res = c.fetchone()

            fakeflag = 0;
            ##print('FAKEFLAG' + str(fakeflag))
            # if res!=None:
            #     fakeflag = res['fakeflag']
            #     fake_id = res['id']
            ##print('FAKEFLAG' + str(fakeflag))
            # if res==None:
            #     sql = '''INSERT INTO checkpoints (results_id, name, timeofday, timepassed, distance, location_order, fakeflag)
            #             VALUES (%s,%s,%s,%s,%s,%s,%s)'''
            #     params = (_id, "start", starttime, "00:00:00", 0, 0, 1)
            #     try:
            #         c.execute(sql , params)
            #
            #     except pymysql.err.InternalError as e:
            #         code, msg = e.args
            #         print('WARNING ' +str(code) + ': ' + msg)
            #
            #     except pymysql.err.IntegrityError as e:
            #         code, msg = e.args
            #         print('WARNING ' +str(code) + ': ' + msg)

            timetemp = time.split(":")
            timetempsum = int(timetemp[0])*60*60 + int(timetemp[1])*60 + int(timetemp[2])

            if location == "finnish" and timetempsum <= 59:
                continue;

            ##   For every checkpoint that will be passed under one hour
            if race == "Copper Trail" and int(timetemp[0]) > 10 :
                time = "00:" + timetemp[0] + ":" + timetemp[1]
            if fakeflag :
                sql = '''UPDATE checkpoints
                            SET timeofday = %s, timepassed = %s, distance = %s, location_order = %s, fakeflag = %s
                            WHERE results_id = %s AND name = %s'''
                params = (timeofday, time, distance, location_order, fakeflag, _id, location)
            else :
                sql = '''INSERT INTO checkpoints (results_id, name, timeofday, timepassed, distance, location_order, fakeflag)
                         VALUES (%s,%s,%s,%s,%s,%s, 0)'''
                params = (_id, location, timeofday, time, distance, location_order)

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


    __BYDALEN__ = 1
    __27K__ = 1
    __FJALLMARATON__ = 1
    __KVARTSMARATON__ = 1
    __VALLISTERUNT__ = 1
    __COPPERTRAIL__ = 1
    __VERTICALK__ = 1
    __OPPETFJALL__ = 1

    ##############################################
    ##                                          ##
    ##  Bydalen                                 ##
    ##                                          ##
    ##############################################
    if __BYDALEN__ :
        race = 'Bydalen Fjällmaraton'
        print("start: " + race)

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
        #race = 'Bydalen Fjällmaraton 22K'
        x_stage="22K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_22km_herrar1.csv', race, year, x_stage, x_gender, x_class)
        #50K
        #race = 'Bydalen Fjällmaraton 50K'
        x_stage="50K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_50km_herrar5.csv', race, year, x_stage, x_gender, x_class)
        #Damer
        x_gender="F"
        x_class="Kvinnor"
        #22K
        #race = 'Bydalen Fjällmaraton 22K'
        x_stage="22K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_22km_damer2.csv', race, year, x_stage, x_gender, x_class)
        #50K
        #race = 'Bydalen Fjällmaraton 50K'
        x_stage="50K"
        collectFromBydalen14Csv(conn, 'csv/Bydalen/2014_50km_damer3.csv', race, year, x_stage, x_gender, x_class)

        #race = 'Bydalen Fjällmaraton'
        print("end: " + race)
    ##############################################
    ##                                          ##
    ##  27K                                     ##
    ##                                          ##
    ##############################################

    if __27K__ :
        race = '27k'
        print("start: " + race)

        #Results 27K 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/27K/27K_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/27K/27K_2017_mellantider.csv', race, year)

        #Results 27K 2016
        year=2016
        collectFromResultatCsv(conn, 'csv/27K/27K_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/27K/27K_2016_mellantider.csv', race, year)
        print("end: " + race)
    ##############################################
    ##                                          ##
    ##  Fjällmaraton                            ##
    ##                                          ##
    ##############################################

    if __FJALLMARATON__ :
        print("start: " + race)
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
        #inkluderar kvartsmaraton
        year=2015
        collectFromResultatCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2015_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Fjallmaraton/Fjallmaraton_2015_mellantider.csv', race, year)
        print("end: " + race)
    ##############################################
    ##                                          ##
    ##  Kvartsmaraton                           ##
    ##                                          ##
    ##############################################

    if __KVARTSMARATON__ :
        race = 'Kvartsmaraton'
        print("start: " + race)

        year=2017
        collectFromResultatCsv(conn, 'csv/Kvartsmaraton/Kvartsmaraton_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Kvartsmaraton/Kvartsmaraton_2017_mellantider.csv', race, year)

        year=2016
        collectFromResultatCsv(conn, 'csv/Kvartsmaraton/Kvartsmaraton_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/Kvartsmaraton/Kvartsmaraton_2016_mellantider.csv', race, year)
        print("end: " + race)

    if __VALLISTERUNT__ :
        race = 'Välliste Runt'
        print("start: " + race)

        year=2017
        collectFromResultatCsv(conn, 'csv/VallisteRunt/VallisteRunt_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/VallisteRunt/VallisteRunt_2017_mellantider.csv', race, year)
        print("end: " + race)

    if __COPPERTRAIL__ :
        race = 'Copper Trail'
        print("start: " + race)

        #Results Copper Trail 2017
        year=2017
        collectFromResultatCsv(conn, 'csv/CopperTrail/CopperTrail_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/CopperTrail/CopperTrail_2017_mellantider.csv', race, year)
        print("end: " + race)

    if __VERTICALK__ :
        race = 'Vertical K'
        print("start: " + race)

        year=2017
        collectFromResultatCsv(conn, 'csv/VerticalK/VerticalK_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/VerticalK/VerticalK_2017_mellantider.csv', race, year)

        year=2016
        collectFromResultatCsv(conn, 'csv/VerticalK/VerticalK_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/VerticalK/VerticalK_2016_mellantider.csv', race, year)
        print("end: " + race)

    if __OPPETFJALL__ :
        race = 'Öppet Fjäll'
        print("start: " + race)

        year=2017
        collectFromResultatCsv(conn, 'csv/OppetFjall/OppetFjall_2017_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/OppetFjall/OppetFjall_2017_mellantider.csv', race, year)

        year=2016
        collectFromResultatCsv(conn, 'csv/OppetFjall/OppetFjall_2016_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/OppetFjall/OppetFjall_2016_mellantider.csv', race, year)

        year=2015
        collectFromResultatCsv(conn, 'csv/OppetFjall/OppetFjall_2015_resultat.csv', race, year)
        collectFromCheckpointsCsv(conn, 'csv/OppetFjall/OppetFjall_2015_mellantider.csv', race, year)
        print("end: " + race)
    conn.close()
