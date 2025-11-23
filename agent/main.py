from fastapi import FastAPI
from pydantic import BaseModel
import sys, os, traceback

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

from agent.chatbot import get_plant_care_advice
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

@app.post("/plant-care-advice")
async def plant_care_advice(request: dict):
    try:
        user_question = request.get("question", "")
        if not user_question:
            return {"error": "Câu hỏi không được để trống."}
        
        advice = get_plant_care_advice(user_question)
        return {"advice": advice}
    
    except Exception as e:
        traceback.print_exc()
        return {"error": "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."}