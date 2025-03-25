import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to login page
  redirect("/login")
  
  // Alternatively, you could create a landing page here instead of redirecting
  // return (
  //   <div>
  //     Landing page content
  //   </div>
  // )
}
