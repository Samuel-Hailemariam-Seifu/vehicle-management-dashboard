import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VehicleTable = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ name: '', status: 'Active' });
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState({ id: '', status: '' });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleAddVehicle = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/vehicles', newVehicle);
            setVehicles([res.data, ...vehicles]);
            setShowAddModal(false);
            setNewVehicle({ name: '', status: 'Active' });
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/api/vehicles/${currentVehicle.id}`, {
                status: currentVehicle.status
            });
            setVehicles(vehicles.map(v => v._id === res.data._id ? res.data : v));
            setShowEditModal(false);
            setCurrentVehicle({ id: '', status: '' });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const openEditModal = (vehicle) => {
        setCurrentVehicle({ id: vehicle._id, status: vehicle.status });
        setShowEditModal(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Vehicle Management Dashboard</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setShowAddModal(true)}
                >
                    Add New Vehicle
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Vehicle Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Last Updated</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle._id} className="text-center">
                                <td className="py-2 px-4 border-b">{vehicle.name}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            vehicle.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : vehicle.status === 'Inactive'
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(vehicle.lastUpdated).toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                        onClick={() => openEditModal(vehicle)}
                                    >
                                        Update Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Vehicle Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
                        <h3 className="text-xl font-semibold mb-4">Add New Vehicle</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Vehicle Name</label>
                            <input
                                type="text"
                                className="w-full mt-1 p-2 border rounded"
                                placeholder="Enter vehicle name"
                                value={newVehicle.name}
                                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Status</label>
                            <select
                                className="w-full mt-1 p-2 border rounded"
                                value={newVehicle.status}
                                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Maintenance</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                                onClick={() => setShowAddModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleAddVehicle}
                            >
                                Add Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Status Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
                        <h3 className="text-xl font-semibold mb-4">Update Vehicle Status</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Status</label>
                            <select
                                className="w-full mt-1 p-2 border rounded"
                                value={currentVehicle.status}
                                onChange={(e) => setCurrentVehicle({ ...currentVehicle, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Maintenance</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                                onClick={() => setShowEditModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={handleUpdateStatus}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default VehicleTable;
