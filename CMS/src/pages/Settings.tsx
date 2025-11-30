import { SideBar } from "../components/SideBar";
import { Button } from "../components/Button";

export const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600 text-sm mb-6 sm:mb-8 lg:mb-10">
          Manage your HopIn hotel chain settings.
        </p>

        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* HOTEL INFORMATION */}
          <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Hotel Information</h2>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              Update your hotel chain details here.
            </p>

            <form className="space-y-4 sm:space-y-5">
              <div>
                <label className="font-medium text-sm sm:text-base">Hotel Chain Name</label>
                <input
                  type="text"
                  placeholder="HopIn Hotels"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Description</label>
                <textarea
                  placeholder="Premium hotel chain with locations across South Africa"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg h-24 sm:h-28 text-sm sm:text-base"
                ></textarea>
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Contact Email</label>
                <input
                  type="email"
                  placeholder="info@hopin.co.za"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Phone Number</label>
                <input
                  type="text"
                  placeholder="+27 11 123 4567"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <Button variant="primary">Save Changes</Button>
            </form>
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Notifications</h2>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              Configure notification preferences.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {[
                ["New Booking Alerts", "Get notified when new bookings are made"],
                ["Cancellation Alerts", "Get notified when bookings are cancelled"],
                ["Daily Reports", "Receive daily performance reports via email"],
                ["Review Notifications", "Get notified when guests leave reviews"],
              ].map(([title, desc]) => (
                <div key={title} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{desc}</p>
                  </div>
                  {/* Switch Placeholder */}
                  <div className="w-12 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT SETTINGS */}
          <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Payment Settings</h2>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              Configure payment methods and pricing.
            </p>

            <form className="space-y-4 sm:space-y-5">
              <div>
                <label className="font-medium text-sm sm:text-base">Default Currency</label>
                <input
                  type="text"
                  placeholder="ZAR (South African Rand)"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Tax Rate (%)</label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="font-medium text-sm sm:text-base">Accept Online Payments</label>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Allow guests to pay online during booking.
                  </p>
                </div>
                {/* Switch */}
                <div className="w-12 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="font-medium text-sm sm:text-base">Require Deposit</label>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Require a deposit for all bookings.
                  </p>
                </div>
                {/* Switch */}
                <div className="w-12 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              </div>

              <Button variant="primary">Update Payment Settings</Button>
            </form>
          </section>

          {/* SECURITY */}
          <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Security</h2>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              Manage security and access controls.
            </p>

            {/* Two-Factor Auth */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <label className="font-semibold text-sm sm:text-base">Two-Factor Authentication</label>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
            </div>

            {/* Session Timeout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex-1">
                <label className="font-semibold text-sm sm:text-base">Session Timeout</label>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Auto-logout after 30 minutes of inactivity.
                </p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
            </div>

            {/* Password Change */}
            <form className="space-y-4 sm:space-y-5">
              <div>
                <label className="font-medium text-sm sm:text-base">Change Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg text-sm sm:text-base"
                />
              </div>

              <Button variant="secondary">Update Password</Button>
            </form>
          </section>

          {/* EMAIL TEMPLATES */}
          <section className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">Email Templates</h2>
            <p className="text-gray-600 text-sm mb-4 sm:mb-6">
              Customize automated email messages.
            </p>

            <form className="space-y-4 sm:space-y-5">
              <div>
                <label className="font-medium text-sm sm:text-base">Booking Confirmation Email</label>
                <textarea
                  placeholder="Thank you for booking with HopIn! Your reservation is confirmed."
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg h-24 sm:h-28 text-sm sm:text-base"
                ></textarea>
              </div>

              <div>
                <label className="font-medium text-sm sm:text-base">Cancellation Email</label>
                <textarea
                  placeholder="We're sorry to see you go. Your booking has been cancelled."
                  className="w-full mt-1 p-2 sm:p-3 border rounded-lg h-24 sm:h-28 text-sm sm:text-base"
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