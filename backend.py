from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
from pip._vendor import requests
from flask import request, json, jsonify
import traceback
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

internship_values = []

#scrapes internships from job postings -> list of dict
def scrape():
    #print("called scrape!")
    url = <URL>
    response = requests.get(url)
    global internship_values
    return parseHTML(response.content)
    
def parseHTML(content):

    soup = BeautifulSoup(content, 'html.parser')
    
    table = soup.find_all('script')
    
    #contains data payload, assuming its last script
    #update later to scrape one certain script
    table = table[-1]

    for word in table:
        data_json = json.loads(word)
    
    json_soup = BeautifulSoup(str(data_json), 'html.parser')
    
    #limit = 52 = 50 elements
    payload_data = json_soup.findAll('tr', limit=52)
    
    payload_soup = BeautifulSoup(str(payload_data), 'html.parser')
       
    payload_row_data = payload_soup.findAll('td')
    
    # array with the list with final data.. format: company name, role name, location(s), application link, date posted 
    final_data = []
    
    #application links from payload data
    data_count = 0
    temp =[]
    index = 0
    for value in payload_row_data:
        
        if data_count == 5:
            final_data.append(temp.copy())
            temp.clear()
            data_count = 0
            link_soup = BeautifulSoup(str(payload_data[index + 1]), 'html.parser')
            link_list = link_soup.find_all('a', limit=2, href=True)
            if len(link_list) == 0:
                final_data[index][3] = "No Longer Accepting Applications"
                continue
            final_data[index][3] = link_list[1].get('href') if len(link_list) > 1 else link_list[0].get('href')
            index += 1
            
        temp.append(value.text)
        data_count += 1
    
    '''
    #write data to a file for better view
    
    f = open("data_file.txt", "a")
    f.write(str(data_json))
    f.close()
    '''
    
    internships = []
    #modify structure from job board
    i = 0
    title = ''
    for internPosting in final_data:
        if internPosting and len(internPosting) == 5 and i < index - 1:
            if internPosting[0] == '↳':
                internPosting[0] = title
            else:
                title = internPosting[0]
                
            if internPosting[2] == "Remote in USAUnited States":
                internPosting[2] = "Remote in the USA"
            if '🛂' in internPosting[1]:
                s = internPosting[1]
                s = s.replace('🛂', '')
                internPosting[1] = s
                
            if len(internPosting[2]) > 20:
                internPosting[2] = "Multiple Locations"
            
            internship = {
                'company': internPosting[0],
                'role': internPosting[1],
                'location': internPosting[2],
                'link': internPosting[3],
                'date': internPosting[4]
                }
            i += 1
            internships.append(internship)
            
    #print("internship data list" + str(internships))       
    return jsonify(internships)
    
#function to fetch internships w/ API route 
@app.route('/')
@cross_origin()
def get_data():
    global internship_values
    return scrape()

@app.route("/resume", methods=["POST"])
@cross_origin()
def build_resume():
    data=request.json
    try:
        if request.method == 'POST':
            page = buildTemplate(data)
            print("Got POST request ... " + str(request.json))
            return jsonify(page)
        else:
            return jsonify(isError=True, message="Method not allowed", statusCode=404), 404
    except:
        print(traceback.format_exc())
        return jsonify(isError=True, message="Exception, check backend", statusCode=500), 500
    
def buildTemplate(info):
    return render_template("resume.html", data=info)


if __name__ == '__main__':

    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape, 'interval', hours=24)
    scheduler.start()
    app.run(host='0.0.0.0',debug=True)

    
        
        




