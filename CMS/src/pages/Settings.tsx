import { SideBar } from "../components/SideBar";
import { Button } from "../components/Button";

export const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10 overflow-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600 text-sm mb-10">
          Manage your HopIn hotel chain settings.
        </p>

        <div className="space-y-10">
          {/* HOTEL INFORMATION */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-1">Hotel Information</h2>
            <p className="text-gray-600 mb-6">
              Update your hotel chain details here.
            </p>

            <form className="space-y-5">
              <div>
                <label className="font-medium">Hotel Chain Name</label>
                <input
                  type="text"
                  placeholder="HopIn Hotels"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium">Description</label>
                <textarea
                  placeholder="Premium hotel chain with locations across South Africa"
                  className="w-full mt-1 p-3 border rounded-lg h-28"
                ></textarea>
              </div>

              <div>
                <label className="font-medium">Contact Email</label>
                <input
                  type="email"
                  placeholder="info@hopin.co.za"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium">Phone Number</label>
                <input
                  type="text"
                  placeholder="+27 11 123 4567"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <Button variant="primary">Save Changes</Button>
            </form>
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-1">Notifications</h2>
            <p className="text-gray-600 mb-6">
              Configure notification preferences.
            </p>

            <div className="space-y-6">
              {[
                ["New Booking Alerts", "Get notified when new bookings are made"],
                ["Cancellation Alerts", "Get notified when bookings are cancelled"],
                ["Daily Reports", "Receive daily performance reports via email"],
                ["Review Notifications", "Get notified when guests leave reviews"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-gray-600 text-sm">{desc}</p>
                  </div>
                  {/* Switch Placeholder */}
                  <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT SETTINGS */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-1">Payment Settings</h2>
            <p className="text-gray-600 mb-6">
              Configure payment methods and pricing.
            </p>

            <form className="space-y-5">
              <div>
                <label className="font-medium">Default Currency</label>
                <input
                  type="text"
                  placeholder="ZAR (South African Rand)"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium">Tax Rate (%)</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Accept Online Payments</label>
                  <p className="text-gray-600 text-sm">
                    Allow guests to pay online during booking.
                  </p>
                </div>
                {/* Switch */}
                <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Require Deposit</label>
                  <p className="text-gray-600 text-sm">
                    Require a deposit for all bookings.
                  </p>
                </div>
                {/* Switch */}
                <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
              </div>

              <Button variant="primary">Update Payment Settings</Button>
            </form>
          </section>

          {/* SECURITY */}
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-1">Security</h2>
            <p className="text-gray-600 mb-6">
              Manage security and access controls.
            </p>

            {/* Two-Factor Auth */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="font-semibold">Two-Factor Authentication</label>
                <p className="text-gray-600 text-sm">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
            </div>

            {/* Session Timeout */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <label className="font-semibold">Session Timeout</label>
                <p className="text-gray-600 text-sm">
                  Auto-logout after 30 minutes of inactivity.
                </p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
            </div>

            {/* Password Change */}
            <form className="space-y-5">
              <div>
                <label className="font-medium">Change Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full mt-1 p-3 border rounded-lg"
                />
              </div>

              <Button variant="secondary">Update Password</Button>
            </form>
          </section>

          {/* EMAIL TEMPLATES */}
          <section className="bg-white p-8 rounded-xl shadow mb-20">
            <h2 className="text-2xl font-semibold mb-1">Email Templates</h2>
            <p className="text-gray-600 mb-6">
              Customize automated email messages.
            </p>

            <form className="space-y-5">
              <div>
                <label className="font-medium">Booking Confirmation Email</label>
                <textarea
                  placeholder="Thank you for booking with HopIn! Your reservation is confirmed."
                  className="w-full mt-1 p-3 border rounded-lg h-28"
                ></textarea>
              </div>

              <div>
                <label className="font-medium">Cancellation Email</label>
                <textarea
                  placeholder="We're sorry to see you go. Your booking has been cancelled."
                  className="w-full mt-1 p-3 border rounded-lg h-28"
                ></textarea>
              </div>

              <Button variant="secondary">Save Template</Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
