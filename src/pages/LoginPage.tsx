import LoginForm from "@/components/modules/login/LoginForm";

import dashboardPreview from "/dashboard-preview.png";

export default function LoginPage() {
  return (
    <main className="h-screen lg:grid lg:grid-cols-7 bg-white p-4">
      <div className="block col-span-3">
        <LoginForm />
      </div>

      <div className="lg:block col-span-4 bg-gray-50 rounded-2xl pl-20 pt-10 h-full hidden">
        <div className="flex flex-col">
          <div className="relative h-[600px]">
            <img
              src={dashboardPreview}
              alt="Dashboard Preview"
              className="w-full h-full object-cover rounded-[12px]"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-white to-transparent rounded-b-[13px]" />
          </div>

          <div className="flex flex-col mt-10 flex-shrink-0">
            <h1 className="text-5xl font-medium text-gray-900 mb-4 leading-tight">
              Team Collaboration <br /> made simple
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl">
              A complete team collaboration platform designed to streamline
              communication, enhance productivity, and bring teams together
              through powerful messaging, task management, and real-time
              collaboration tools.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
