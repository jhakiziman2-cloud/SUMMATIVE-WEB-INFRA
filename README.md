To run the Bitta application locally, follow these steps:

First, download or clone the project repository to your local computer. If using Git, open a terminal and run:


git clone https://github.com/jhakiziman2-cloud/SUMMATIVE-WEB-INFRA


Navigate into the project folder:

cd SUMMATIVE-WEB-INFRA

The project contains the main HTML files, CSS files, and JavaScript files required to run the application

Because the application is a frontend application built with HTML, CSS, and JavaScript, no backend server or database installation is required. The application stores user information, goals, and progress data locally using the browser's localStorage.

To run the application, open the project folder using a code editor such as Visual Studio Code. It is recommended to use the Live Server extension to launch the application.

In Visual Studio Code:

1. Open the project folder.
2. Install the "Live Server" extension if it is not already installed.
3. Right-click on index.html.
4. Select Open with Live Server.

The application will open in the browser.

The user can then create an account through the signup page, log in, and access the dashboard.

The application does not require environment variables or a database because all application data is handled in the browser using JavaScript and localStorage.

For the motivational quote feature, the application uses an external API.

After opening the application locally, the main workflow is:

1. Open the landing page.
2. Create a user account through the signup page.
3. Log in using the created credentials.
4. Access the dashboard.
5. Create goals and record progress.
6. View stored progress, reminders, and motivational content.

The application can be stopped by closing the browser tab or stopping the Live Server extension in Visual Studio Code.
The Bitta application uses an external API to provide motivational content to users on the dashboard. The API integration was implemented using the API Ninjas Quotes API. This API was used to retrieve random inspirational quotes that are displayed in the "Today's Motivation" section of the dashboard. The application sends a request to the API endpoint and receives a JSON response containing the quote text and the author's name, which is then displayed dynamically using JavaScript. The endpoint used in the application was the random quotes endpoint with the inspirational category filter. The official API documentation can be found here: API Ninjas Quotes API documentation.https://api-ninjas.com/api/quotes

The application also uses Google Fonts to improve the visual design and readability of the interface. The Poppins font family was integrated into the HTML files through the Google Fonts service. This library was used to provide consistent typography across pages, including the landing page, dashboard, login page, signup page, and settings page. The official Google Fonts documentation can be found here: Google Fonts documentation.https://developers.google.com/fonts

The deployment process began by preparing the two web servers that would host the Bitta application. The servers were accessed through SSH, and the application repository was cloned directly onto each server inside the Nginx web directory located at /var/www/html. The repository was copied using Git, creating a complete copy of the application files on both servers, including the HTML pages, CSS files, JavaScript files, and other required assets. This ensured that both web servers had identical versions of the application and could independently serve users if needed.
After deploying the application files, the default Nginx configuration on both web servers was updated. Initially, Nginx was serving content from its default directory /var/www/html, which caused the server to display the previous default page instead of the Bitta application. To correct this, the Nginx configuration file located at /etc/nginx/sites-available/default was modified. The root directory was changed from /var/www/html to /var/www/html/SUMMATIVE-WEB-INFRA, which pointed Nginx directly to the deployed application. The index configuration was also updated so that Nginx would load index.html as the main page. After making these changes, the Nginx configuration was tested using sudo nginx -t to ensure there were no syntax errors. Once the configuration was confirmed to be valid, Nginx was restarted using sudo systemctl restart nginx. This process was completed on both web-01 and web-02, allowing both servers to successfully serve the Bitta application independently.
After confirming that both web servers were working correctly, the load balancer server was configured using HAProxy. HAProxy was configured on the load balancer and was backed up before making changes. The HAProxy configuration file located at /etc/haproxy/haproxy.cfg was then edited to create a frontend and backend structure. The frontend was configured to listen for incoming user requests on port 80, while the backend was configured to contain both web servers. The backend used the roundrobin balancing algorithm, which distributes incoming requests evenly between web-01 and web-02. Health checks were also enabled using the check option, allowing HAProxy to verify that each web server was available before forwarding traffic to it.
The HAProxy configuration was tested before restarting the service using sudo haproxy -c -f /etc/haproxy/haproxy.cfg. The validation confirmed that the configuration file was valid. After this, HAProxy was restarted using sudo systemctl restart haproxy, and the service status was checked to confirm that the load balancer was running successfully.
The final step involved connecting the load balancer to the configured domain and SSL certificate. The application was accessed through https://www.barakajoel.tech instead of directly using the server IP address. When the IP address was used, the browser displayed a certificate warning because the SSL certificate was issued for the domain name and not the IP address. Using the domain name resolved the issue because the certificate matched the requested address. HAProxy handled the HTTPS connection from users and forwarded requests to the backend web servers.
The complete request flow became: users access the application through the domain, the request reaches the HAProxy load balancer, HAProxy distributes the request between web-01 and web-02, and the selected Nginx server delivers the Bitta application files to the user. To verify that load balancing was working correctly, temporary identifiers were added to both web servers. Refreshing the application through the load balancer showed requests being served by different servers, confirming that HAProxy was successfully distributing traffic using the round-robin method.
At the end of the deployment process, the Bitta application was successfully hosted on two separate web servers with Nginx, connected behind an HAProxy load balancer, and made accessible through a secure custom domain using HTTPS. This setup provides better reliability because if one web server becomes unavailable, the remaining server can continue serving users. 
LINK TO THE VIDEO IS HERE(PS: DO NOT CLICK TO OPEN THE LINK HERE. FOR SOME REASON IT WON'T WORK. SO COPY THE WHOLE LINK INTO THE BROWSER THEN YOU WILL BE ABLE TO SEE THE WHOLE VIDEO): https://drive.google.com/file/d/1Ik1Pept-stlwMunyRZFnCDyBN6VxjjVA/view?usp=sharing
LINK TO THE DEPLOYED WEBSITE: http://barakajoel.tech
