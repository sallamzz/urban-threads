'use client'

interface OrderFormData {
  name: string
  email: string
  address: string
  city: string
  zip: string
}

interface OrderFormProps {
  data: OrderFormData
  onChange: (data: OrderFormData) => void
}

export function OrderForm({ data, onChange }: OrderFormProps) {
  function update(field: keyof OrderFormData, value: string) {
    onChange({ ...data, [field]: value })
  }

  const inputClass =
    'w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 transition-colors'
  const labelClass = 'block text-sm font-medium text-white/80 mb-1.5'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Alex Johnson"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="alex@example.com"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Street Address</label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="123 Fashion Ave"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="New York"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>ZIP Code</label>
          <input
            type="text"
            value={data.zip}
            onChange={(e) => update('zip', e.target.value)}
            placeholder="10001"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
