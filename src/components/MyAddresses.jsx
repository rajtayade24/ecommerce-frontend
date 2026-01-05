import React from 'react'

const MyAddresses = ({ addresses, isOrder = true, }) => {

  return (
    <div className="mt-4 space-y-3">
      {addresses.length ? (
        addresses.map((a) => (
          <label
            key={a.id}
            className={`flex items-center border rounded-lg p-4 transition-shadow hover:shadow-md ${a.id === selectedAddressId ? 'ring-2 ring-blue-200' : ''
              }`}
          >
            
            <input
              type="radio"
              name="address"
              checked={a.id === selectedAddressId}
              onChange={() => setselectedAddressId(a.id)}
              className="mr-4"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{a.label}</div>
                <div className="ml-auto text-sm text-slate-500">{a.phone}</div>
              </div>

              <div className="text-sm text-slate-600 mt-2">{a.line1}</div>
              <div className="text-sm text-slate-600">{a.line2} — {a.city}, {a.state} — <span className="font-medium">{a.pincode}</span></div>
            </div>


            <Button
              onClick={handleDeliver}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              DELIVER HERE
            </Button>
          </label>
        ))
      ) : (
        <div className="p-6 text-center text-slate-500">No saved addresses. Add a new address to continue.</div>
      )}

      <div className="pt-2 border-t">
        <Button className="text-sm text-blue-600 mt-3">+ Add a new address</Button>
      </div>
    </div>
  )
}

export default MyAddresses
