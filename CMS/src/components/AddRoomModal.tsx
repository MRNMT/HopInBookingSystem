import { Button } from "./Button"

export const AddRoomModal = () => {
  return (
    <div>
        <h1>Add New Room</h1>
        <span>Create a new room in your hotel inventory. Fill in all the details below</span>
        <form action="">
            <label htmlFor="">Room Picture</label><br />
            <input type="text" placeholder='Chose File' /><br />
            <label htmlFor="">Room ID</label><br />
            <input type="text" placeholder='e.g., R111' /><br />
            <label htmlFor="">Room Type</label><br />
            <input type="text" placeholder='e.g.,Deluxe Suite' /><br />
            <label htmlFor="">Room Name</label><br />
            <select aria-label="room_name" name="" id="">
                <option value="">Polokwane</option>
                <option value="">Pretoria</option>
                <option value="">Cape Town</option>
                <option value="">Mbombela</option>
                <option value="">Giyani</option>
            </select>
            <div className='flex'>
                <div>
                    <label htmlFor="">Capacity</label><br />
                    <input type="text" placeholder='Enter Capacity' /><br />
                </div>
                <div>
                    <label htmlFor="">Price/Night</label><br />
                    <input type="text" placeholder='Enter Price' /><br />
                </div>
            </div>
            <label htmlFor="">Status</label><br />
            <select name="status" id="status" aria-label="status">
                <option value="">Available</option>
                <option value="">Occupied</option>
                
            </select>
            <div className="flex">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Add</Button>

            </div>
        </form>
    </div>
  )
}
