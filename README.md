## Freelancehunt Project Rating Enhancer

This browser extension enhances the Freelancehunt project list by adding a project rating, employer online status, and employer reviews directly to the project list. This makes it easier for freelancers to quickly assess the quality and attractiveness of a project.

### Features

* **Project Rating:** A 10-star rating system based on the project budget, number of bids, currency, and employer reviews. Higher-rated projects represent potentially better-paying and less competitive opportunities.
* **Employer Online Status:**  Displays whether the employer is currently online or offline. For offline employers, the last time they were online is shown.
* **Employer Reviews:** Shows the number of positive and negative reviews an employer has received, giving freelancers more insight into their reputation.

### Installation

1. **Install a Browser Extension Manager:** If you don't have one already, install a browser extension manager like Tampermonkey:
    * **Chrome:** [https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * **Firefox:** [https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
2. **Create a New Script:** Open the Tampermonkey dashboard and create a new script.
3. **Copy and Paste the Code:** Copy the code from the provided `script.js` file and paste it into the new Tampermonkey script.
4. **Save the Script:** Save the script in Tampermonkey.
5. **Start Browsing Freelancehunt:** The extension will automatically start working on all Freelancehunt project listing pages. 

### How it Works

The extension uses the Tampermonkey API to inject JavaScript code into the Freelancehunt website. This code then does the following:

1. **Fetches Project Data:** Retrieves the budget, number of bids, and currency from each project listing.
2. **Fetches Employer Data:**  Sends a request to the employer's profile page to get their online status and reviews.
3. **Calculates Rating:**  Calculates the project rating using a formula that takes into account the collected data.
4. **Displays Information:**  Adds the calculated rating, online status, and reviews to the project listing on the page.

### Screenshot
![image](https://github.com/CodeCouturiers/Freelancehunt-Project-Rating-Enhancer/assets/170822292/7852282d-95c5-4341-ad1f-b68e5a69fa3e)


### Disclaimer

This extension is provided "as is" without warranty of any kind. Use it at your own risk. The extension's functionality may be affected by changes made to the Freelancehunt website. 
