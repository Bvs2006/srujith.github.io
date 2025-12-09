'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-context';
import { updateTeacherProfileAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoaderCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  );
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const initialState = { message: null, errors: {} };
  
  const updateAction = async (prevState: any, formData: FormData) => {
    if (user) {
      return updateTeacherProfileAction(user.id, prevState, formData);
    }
    return { message: 'User not found.', errors: {} };
  };

  const [state, dispatch] = useActionState(updateAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? 'Error' : 'Success',
        description: state.message,
        variant: state.errors ? 'destructive' : 'default',
      });
      if (!state.errors && user) {
        // This is a mock update; in a real app, you'd refetch the user or get the updated user from the action
        const updatedUser = {...user, name: (document.getElementById('name') as HTMLInputElement).value, subject: (document.getElementById('subject') as HTMLInputElement).value };
        login(updatedUser);
      }
    }
  }, [state, toast, login]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0];
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-primary">{user.subject}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={user.name} required />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Primary Subject</Label>
              <Input id="subject" name="subject" defaultValue={user.subject} />
              {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject[0]}</p>}
            </div>
            
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
