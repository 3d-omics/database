# 3d'omics Database

## How to run locally

Follow these steps to run the project locally with Vite:

1. **Clone and install**

   ```bash
   git clone https://github.com/3d-omics/database.git
   cd database
   npm install
  ```

2. **Add environment variable**

- Create a `.env` file in the root of the project.
- Add the Airtable API key to the `.env` file. For Vite, environment variables must start with VITE_ to be exposed to the frontend:


  ```bash
  VITE_AIRTABLE_API_KEY=airtable_api_key_here
  ```


3. **Run**

  ```bash
  npm run dev
  ```

  Open http://localhost:5173 (or the port shown in your terminal) to see the project running.



# database
