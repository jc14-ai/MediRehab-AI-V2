# MediRehab AI 2.0
## DEVELOPMENT SETUP

### 1. Clone this repository.
```bash
clone https://github.com/jc14-ai/MediRehab-AI-V2.git
```
### 2. Navigate inside the folder.
```bash
cd MediRehab-AI-V2
```
### 3. Navigate to client folder then install dependencies.
```bash
cd next
npm install
```
### 4. Navigate to data folder then create local environment and install requirements.txt.
```bash
cd ../data
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt # do this if our projects contains requirements.txt already
```
### 5. Run Flask server.
```bash
python App.py
```
### 6. Run NextJS server.
```bash
cd ../client
npm run dev
```
