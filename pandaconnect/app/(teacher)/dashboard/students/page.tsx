'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { ColumnDef } from '@tanstack/react-table';
import { Id } from '@/convex/_generated/dataModel';

type FormState = { name: string; parentEmails: string };

type Student = {
  _id: Id<"students">;
  name: string;
  parentIds: string[];
  pendingParentEmails: string[];
  classId?: string;
  teacherId: string;
  schoolId: string;
  createdAt: number;
};

export default function StudentsPage() {
  const students = useQuery(api.students.listStudentsByTeacher) ?? [];
  const createStudent = useMutation(api.students.createStudent);
  const updateStudent = useMutation(api.students.updateStudent);
  const deleteStudent = useMutation(api.students.deleteStudent);
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"students"> | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', parentEmails: '' });
  const [deleteId, setDeleteId] = useState<Id<"students"> | null>(null);

  const reset = () => {
    setForm({ name: '', parentEmails: '' });
    setEditingId(null);
  };

  const onSubmit = async () => {
    const parentIds = form.parentEmails
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      await updateStudent({ 
        studentId: editingId, 
        name: form.name, 
        parentIds,
        pendingParentEmails: [],
        classId: undefined
      });
      toast({ description: 'Student updated.' });
    } else {
      await createStudent({ 
        name: form.name, 
        parentIds,
        pendingParentEmails: [],
        classId: undefined
      });
      toast({ description: 'Student added.' });
    }
    reset();
    setIsOpen(false);
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'parentIds',
      header: 'Parents',
      cell: ({ row }) => {
        const parentIds = row.getValue('parentIds') as string[];
        return parentIds.length;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingId(student._id);
                setForm({ name: student.name, parentEmails: student.parentIds.join(',') });
                setIsOpen(true);
              }}
            >
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" onClick={() => setDeleteId(student._id)}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <p>Are you sure you want to delete this student?</p>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setDeleteId(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (deleteId) {
                        await deleteStudent({ studentId: deleteId });
                        toast({ description: 'Student deleted.' });
                        setDeleteId(null);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-800">Students</h1>
        <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Student' : 'Add Student'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Student Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                placeholder="Comma-separated Parent Clerk IDs"
                value={form.parentEmails}
                onChange={(e) => setForm({ ...form, parentEmails: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button onClick={onSubmit}>{editingId ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={students} />
    </div>
  );
}
