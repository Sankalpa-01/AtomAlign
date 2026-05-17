// import { cookies } from "next/headers";
// import prisma from "@/lib/prisma";
// import { redirect } from "next/navigation";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { updateUserAccount } from "@/actions/user.actions";
// import SettingsForm from "@/components/forms/settings-form";

// export default async function SettingsPage() {
//   const cookieStore = await cookies();
//   const userId = cookieStore.get("atomquest_session")?.value;

//   if (!userId) redirect("/login");

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { id: true, name: true, email: true },
//   });

//   if (!user) redirect("/login");

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
//         <p className="text-muted-foreground mt-2">
//           Update your profile information and manage your account security.
//         </p>
//       </div>

//       <SettingsForm user={user} />

//       <Card>
//         <CardHeader>
//           <CardTitle>Profile Details</CardTitle>
//           <CardDescription>Changes will be reflected across the portal.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form
//             // wrap the imported action to satisfy the expected return type (void | Promise<void>)
//             action={async (formData: FormData) => {
//               await updateUserAccount(formData);
//             }}
//             className="space-y-4"
//           >
//             {/* Hidden input to pass the user ID to the server action */}
//             <input type="hidden" name="userId" value={user.id} />
            
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" name="name" defaultValue={user.name || ""} required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email Address</Label>
//               <Input id="email" name="email" type="email" defaultValue={user.email || ""} required />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">New Password</Label>
//               <Input 
//                 id="password" 
//                 name="password" 
//                 type="password" 
//                 placeholder="Leave blank to keep current password" 
//               />
//             </div>

//             <Button type="submit" className="mt-4">Save Changes</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/forms/settings-form";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("atomquest_session")?.value;

  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true }, 
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and manage your account security.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}