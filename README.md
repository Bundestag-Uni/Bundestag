# Bundestag
In this project we use the API provided by the Bundestag to get speech data and protocols to analyse them and get insights about different metrics.

# Features 
- Homepage: The Homepage of the website provides the user an overview of the project.
- Yap-o-meter: Visualizes speech efficiency of German politicians and political parties, visualizes the average words per speech of German politicians and parties. 
- Zwischenrufe: Shows how many interruptions a politician and party has made/how often a politician and a party is interrupted during a speech, features a bar chart that shows how many interruptions have been made per year since 2013 and features a search function where the user can search for specific words.
- Personensuche: Search function for searching for specific politicians, features specific information about them.
- Methodik: Gives the user an overview of how the data was curated.

## Technologies used 
- React Framework
- Javascript / JSX 
- recharts-library 
- p5js-library 

## Getting Started

First, run the development server:

```bash
npm install dev
sudo docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
