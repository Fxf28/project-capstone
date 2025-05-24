from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionProvideWasteInfo(Action):
    def name(self) -> Text:
        return "action_provide_waste_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        waste_type = tracker.get_slot("waste_type")
        
        if not waste_type:
            dispatcher.utter_message(text="What type of waste are you asking about?")
            return []
        
        waste_type = waste_type.lower()
        
        if "plastic" in waste_type:
            dispatcher.utter_message(template="utter_plastic_recycling")
        elif "paper" in waste_type or "cardboard" in waste_type:
            dispatcher.utter_message(template="utter_paper_recycling")
        elif "glass" in waste_type:
            dispatcher.utter_message(template="utter_glass_recycling")
        elif "metal" in waste_type or "aluminum" in waste_type or "steel" in waste_type:
            dispatcher.utter_message(template="utter_metal_recycling")
        elif "food" in waste_type or "organic" in waste_type or "compost" in waste_type:
            dispatcher.utter_message(template="utter_composting")
        elif "electronic" in waste_type or "e-waste" in waste_type or "device" in waste_type:
            dispatcher.utter_message(template="utter_e_waste_disposal")
        elif "hazardous" in waste_type or "chemical" in waste_type or "toxic" in waste_type:
            dispatcher.utter_message(template="utter_hazardous_waste")
        else:
            dispatcher.utter_message(text=f"I don't have specific information about {waste_type} recycling. Would you like to know about general recycling guidelines instead?")
        
        return []