"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Question } from "@/lib/supabase/types";
import {
  createQuestion,
  deleteQuestion,
  reorderQuestions,
  toggleQuestionActive,
  updateQuestionText,
} from "./actions";

export function QuestionsManager({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  const activeCount = questions.filter((q) => q.is_active).length;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQuestions((prev) => {
      const oldIndex = prev.findIndex((q) => q.id === active.id);
      const newIndex = prev.findIndex((q) => q.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderQuestions(reordered.map((q) => q.id));
      return reordered;
    });
  }

  async function handleToggleActive(question: Question, checked: boolean) {
    setQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, is_active: checked } : q)));
    await toggleQuestionActive(question.id, checked);
  }

  async function handleTextSave(question: Question, text: string) {
    if (text.trim() && text !== question.text) {
      setQuestions((prev) => prev.map((q) => (q.id === question.id ? { ...q, text } : q)));
      await updateQuestionText(question.id, text);
    }
  }

  async function handleAdd(text: string) {
    setAddOpen(false);
    const created = await createQuestion(text);
    if (created) setQuestions((prev) => [...prev, created]);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setDeleteTarget(null);
    await deleteQuestion(id);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Questions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeCount} of {questions.length} questions active — this is what your customers see.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add question
        </Button>
      </div>

      {activeCount > 5 && (
        <Alert className="mt-4">
          <AlertDescription>
            More than 5 questions lowers completion rates. Consider turning a few off.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 rounded-xl border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Question</TableHead>
                <TableHead className="w-20">Active</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
                {questions.map((question) => (
                  <SortableQuestionRow
                    key={question.id}
                    question={question}
                    onToggleActive={(checked) => handleToggleActive(question, checked)}
                    onTextSave={(text) => handleTextSave(question, text)}
                    onDelete={() => setDeleteTarget(question)}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <AddQuestionDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this question?</AlertDialogTitle>
            <AlertDialogDescription>
              This won&apos;t delete answers already collected for it, but customers will no longer be
              asked it. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SortableQuestionRow({
  question,
  onToggleActive,
  onTextSave,
  onDelete,
}: {
  question: Question;
  onToggleActive: (checked: boolean) => void;
  onTextSave: (text: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(question.text);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function save() {
    setEditing(false);
    onTextSave(value);
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        {editing ? (
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setValue(question.text);
                setEditing(false);
              }
            }}
          />
        ) : (
          <button
            className="text-left text-sm hover:underline"
            onClick={() => setEditing(true)}
          >
            {question.text}
          </button>
        )}
      </TableCell>
      <TableCell>
        <Switch checked={question.is_active} onCheckedChange={onToggleActive} />
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete question">
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function AddQuestionDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a question</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="question-text">Question</Label>
            <Textarea
              id="question-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
