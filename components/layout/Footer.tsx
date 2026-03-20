export function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-display text-2xl text-white tracking-widest">UrbanThreads</h3>
            <p className="text-navy-500 text-sm mt-2 max-w-xs">
              Premium clothing for the modern wardrobe. Earn points with every purchase.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-navy-500">
                <li>Shirts</li>
                <li>Pants</li>
                <li>Dresses</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Loyalty</h4>
              <ul className="space-y-2 text-navy-500">
                <li>Earn Points</li>
                <li>Redeem Rewards</li>
                <li>Tier Benefits</li>
                <li>My Account</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-8 pt-8 text-center text-navy-500 text-xs">
          © {new Date().getFullYear()} UrbanThreads. Powered by Gameball Loyalty.
        </div>
      </div>
    </footer>
  )
}
