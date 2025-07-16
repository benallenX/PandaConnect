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
import { useState, useEffect } from 'react';
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
  const ensureTeacherRecord = useMutation(api.students.ensureTeacherRecord);
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"students"> | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', parentEmails: '' });
  const [deleteId, setDeleteId] = useState<Id<"students"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure teacher record exists when component loads
  useEffect(() => {
    ensureTeacherRecord().catch(console.error);
  }, [ensureTeacherRecord]);

  const reset = () => {
    setForm({ name: '', parentEmails: '' });
    setEditingId(null);
    setIsSubmitting(false);
  };

  const onSubmit = async () => {
    // Basic validation
    if (!form.name.trim()) {
      toast({ 
        description: 'Student name is required.', 
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Split parent emails and convert to pending emails for now
      // In a real app, you'd want to validate emails and potentially invite parents
      const pendingParentEmails = form.parentEmails
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (editingId) {
        // Find the current student to preserve existing parent IDs
        const currentStudent = students.find(s => s._id === editingId);
        
        await updateStudent({ 
          studentId: editingId, 
          name: form.name.trim(), 
          parentIds: currentStudent?.parentIds || [], // Keep existing linked parents
          pendingParentEmails,
          classId: currentStudent?.classId
        });
        toast({ description: 'Student updated successfully.' });
      } else {
        await createStudent({ 
          name: form.name.trim(), 
          parentIds: [], // Empty for new students until parents sign up
          pendingParentEmails,
          classId: undefined
        });
        toast({ description: 'Student added successfully.' });
      }
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving student:', error);
      toast({ 
        description: 'Failed to save student. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Student Name',
    },
    {
      accessorKey: 'parentIds',
      header: 'Linked Parents',
      cell: ({ row }) => {
        const parentIds = row.getValue('parentIds') as string[];
        return (
          <span className="text-sm">
            {parentIds.length > 0 ? `${parentIds.length} linked` : 'None linked'}
          </span>
        );
      },
    },
    {
      accessorKey: 'pendingParentEmails',
      header: 'Pending Invites',
      cell: ({ row }) => {
        const pendingEmails = row.getValue('pendingParentEmails') as string[];
        return (
          <span className="text-sm">
            {pendingEmails.length > 0 ? `${pendingEmails.length} pending` : 'None pending'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as number;
        return (
          <span className="text-sm">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        );
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
                setForm({ 
                  name: student.name, 
                  parentEmails: student.pendingParentEmails.join(', ') 
                });
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
                <p>Are you sure you want to delete &ldquo;{student.name}&rdquo;? This action cannot be undone.</p>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setDeleteId(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (deleteId) {
                        try {
                          await deleteStudent({ studentId: deleteId });
                          toast({ description: `${student.name} has been deleted.` });
                          setDeleteId(null);
                        } catch (error) {
                          console.error('Error deleting student:', error);
                          toast({ 
                            description: 'Failed to delete student. Please try again.', 
                            variant: 'destructive' 
                          });
                        }
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
                required
              />
              <Input
                placeholder="Parent emails (comma-separated, e.g., parent1@email.com, parent2@email.com)"
                value={form.parentEmails}
                onChange={(e) => setForm({ ...form, parentEmails: e.target.value })}
                type="email"
              />
              <p className="text-sm text-gray-600">
                Parent emails will be used to invite parents to join the platform.
              </p>
            </div>

            <DialogFooter>
              <Button 
                onClick={onSubmit} 
                disabled={isSubmitting || !form.name.trim()}
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Save' : 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={students} />
    </div>
  );
}
