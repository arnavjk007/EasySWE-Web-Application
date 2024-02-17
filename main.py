from flask import Flask, render_template
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
from pip._vendor import requests
from flask import request, jsonify
import traceback
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

internship_values = []
#scrapes internships from job postings -> list of dict
    
def scrape():
    #print("called scrape!")
    url = "https://github.com/SimplifyJobs/Summer2024-Internships/blob/dev/README.md"
    response = requests.get(url)
    global internship_values
    internship_values = parseHTML(response.content)
    
def parseHTML(content):

    
    soup = BeautifulSoup(content, 'html.parser')
    #one table for github
    div = soup.find_all('table')
    table = div
    #table = div.find('table', class_='')
    print(len(table))

    #gets column titles
    col_titles = soup.find_all('th')

    #gets rid of tags <th>
    col_titles = [title.text.strip() for title in col_titles]
    col_data = soup.find_all('tr')

    #data in each row in a list
    each_row_data = []

    #goes through each row and puts entire row into list -> that list is appended to overall list
    for row in col_data:
        row_data = row.find_all('td')
        each_row_data.append([data.text for data in row_data])    

    #command to find application links
    #col_links = soup.find_all('a')
    col_links = []

    temp = 0
    table = soup.find('table')
    table = soup.find('tbody')
    for row in table.find_all('tr', limit=55):    
        # Find all data for each column
        columns = row.find_all('td')
        col_links.append(columns[3].a['href'])
    
    #gets href link 
    #col_links = [web_link['href'] for web_link in col_links] 

    
    internships = []
    #modify structure from job board
    i = 0
    title = ''
    for internPosting in each_row_data:
        if internPosting and len(internPosting) == 5 and i < 50:
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
            
            link = col_links[i][2:len(col_links[i])-4]
            internship = {
                'company': internPosting[0],
                'role': internPosting[1],
                'location': internPosting[2],
                'link': link,
                'date': internPosting[4],
                    #add more filters
                }

            i += 1
            internships.append(internship)
            
    #print("internship data list" + str(internships))       
    return internships
    
#function to fetch internships w/ API route 
@app.route('/')
@cross_origin()
def get_data():
    global internship_values
    return jsonify(internship_values)  


@app.route("/resume", methods=["POST"])
@cross_origin()
def build_resume():
    data=request.json
    try:
        if request.method == 'POST':
            page = buildTemplate(data)
            print("Got POST request ... " + str(request.json))
            return jsonify(page)
            #return jsonify(isError=False, message="Success", data=page, statusCode=200), 200
        else:
            return jsonify(isError=True, message="Method not allowed", statusCode=404), 404
    except:
        print(traceback.format_exc())
        return jsonify(isError=True, message="Exception, check backend", statusCode=500), 500
    
def buildTemplate(info):
    return render_template("resume.html", data=info)


if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape, 'interval', hours=12)
    scheduler.start()
    app.run(host='0.0.0.0',debug=True)
    #app.run(debug=True)
    
        
        



