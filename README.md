# Admin Guide: Updating Site Data

## 📊 When to Update Data

Update the site whenever you:
- Add new records to Airtable
- Modify existing Airtable data
- Update CSV files (genome metadata, sample counts)


## 🔧 How to Update + Deploy

### Step 1: Update Data Locally
```bash
# Navigate to project directory
cd your-project-folder

# Fetch fresh data from Airtable and regenerate JSON files
npm run generate-data
```

This regenerates all 102 JSON files:
- 9 Airtable tables
- 6 genome metadata files
- 6 macro genome count files
- 83 microsample count files

### Step 2: Test Locally (Optional)
```bash
# Run development server to verify
npm run dev
```

Visit `http://localhost:5173` to check the updated data.

### Step 3: Deploy
```bash
# Build for production
npm run build

# Commit and push (triggers auto-deployment)
git add .
git commit -m "Update data from Airtable"
git push origin main
```

## 🧪 Running Tests

Run unit and integration tests whenever you modify frontend code:
```bash
npm run test
```

**Note:** Tests verify code logic, not data content. You don't need to run tests when only Airtable data changes—the build process will validate that data loads correctly.

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Fetch fresh Airtable data | `npm run generate-data` |
| Test locally | `npm run dev` |
| Run tests (code changes) | `npm run test` |
| Build for production | `npm run build` |
| Deploy | `git push origin main` |
| Quick refresh (no local changes) | `git commit --allow-empty -m "Refresh" && git push` |

## ⚠️ Important Notes

### CSV File Changes
If you update CSV files in `src/assets/data/`:
1. Commit the CSV changes: `git add src/assets/data/ && git commit -m "Update CSV data"`
2. Push: `git push origin main`
3. GitHub Actions will regenerate JSON files automatically

### Generated Files
**NEVER manually edit these folders:**
- `src/assets/data/airtable/`
- `src/assets/data/genome_metadata_json/`
- `src/assets/data/macro_genome_counts_json/`
- `src/assets/data/microsample_counts_json/`

They are auto-generated and will be overwritten.