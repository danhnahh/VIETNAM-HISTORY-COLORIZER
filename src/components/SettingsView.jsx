// components/SettingsView.jsx
import React from 'react';

const SettingsView = ({ photos }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Cài đặt</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="font-medium mb-3">Cài đặt AI</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Tự động tô màu khi upload</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-3">Lưu trữ</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span>Dung lượng đã sử dụng</span>
                            <span className="text-sm text-gray-600">
                {photos.reduce((sum, p) => sum + p.size, 0) / 1024 / 1024 < 1
                    ? `${(photos.reduce((sum, p) => sum + p.size, 0) / 1024).toFixed(0)} KB`
                    : `${(photos.reduce((sum, p) => sum + p.size, 0) / 1024 / 1024).toFixed(1)} MB`
                } / 1 GB
              </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                    width: `${Math.min(100, (photos.reduce((sum, p) => sum + p.size, 0) / 1024 / 1024 / 1024) * 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;