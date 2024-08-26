from fastapi import APIRouter, HTTPException, Depends, Path, Body
from bson import ObjectId
from models.note_model import Note
from config.database import db
from routes.auth_routes import get_current_user

note_router = APIRouter()

@note_router.post("/notes")
async def add_note(note: Note, current_user: dict = Depends(get_current_user)):
    new_note = {
        "title": note.title,
        "content": note.content,
        "author": current_user["username"]
    }
    result = await db.notes.insert_one(new_note)
    return {"message": "Note added successfully", "note_id": str(result.inserted_id)}

@note_router.get("/notes")
async def get_notes(current_user: dict = Depends(get_current_user)):
    notes = await db.notes.find({"author": current_user["username"]}).to_list(length=None)
    return [{"id": str(note["_id"]), "title": note["title"], "content": note["content"], "author": note["author"]} for note in notes]

@note_router.put("/notes/{note_id}")
async def edit_note(
    note_id: str = Path(..., title="The ID of the note to edit"),
    note: Note = Body(...),
    current_user: dict = Depends(get_current_user)
):
    result = await db.notes.update_one(
        {"_id": ObjectId(note_id), "author": current_user["username"]},
        {"$set": {"title": note.title, "content": note.content}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Note not found or you don't have permission to edit it")
    return {"message": "Note updated successfully"}

@note_router.delete("/notes/{note_id}")
async def delete_note(
    note_id: str = Path(..., title="The ID of the note to delete"),
    current_user: dict = Depends(get_current_user)
):
    result = await db.notes.delete_one({"_id": ObjectId(note_id), "author": current_user["username"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found or you don't have permission to delete it")
    return {"message": "Note deleted successfully"}


@note_router.get("/notes/{note_id}")
async def get_note(
    note_id: str = Path(..., title="The ID of the note to retrieve"),
    current_user: dict = Depends(get_current_user)
):
    note = await db.notes.find_one({"_id": ObjectId(note_id), "author": current_user["username"]})
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found or you don't have permission to view it")
    return {
        "id": str(note["_id"]),
        "title": note["title"],
        "content": note["content"],
        "author": note["author"]
    }


