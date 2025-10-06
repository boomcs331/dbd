"use client"
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const RealtimeWebhookDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [stats, setStats] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [newLogs, setNewLogs] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // เชื่อมต่อ WebSocket
        const socket = io('http://localhost:3007/socket', {
            withCredentials: true,
        });

        socketRef.current = socket;

        // เชื่อมต่อ
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('✅ Connected to WebSocket');

            // ขอข้อมูลเริ่มต้น
            socket.emit('get-webhook-logs', {
                
            });

            socket.emit('get-webhook-stats');
        });

        // รับข้อมูล logs
        socket.on('webhook-logs', (response) => {
            console.log('📦 Received webhook logs:', response);
            
            // ตรวจสอบ response format ใหม่
            if (response && response.data && Array.isArray(response.data)) {
                setLogs(response.data || []);
                // ใช้ metadata แทน pagination
                if (response.metadata) {
                    setPagination({
                        page: response.metadata.page,
                        limit: response.metadata.limit,
                        total: response.metadata.total,
                        totalPages: response.metadata.last_page,
                        hasNext: response.metadata.page < response.metadata.last_page,
                        hasPrev: response.metadata.page > 1
                    });
                } else {
                    setPagination({});
                }
            } else {
                console.error('❌ Invalid response format:', response);
                setLogs([]);
                setPagination({});
            }
        });

        // รับข้อมูลสถิติ
        socket.on('webhook-stats', (stats) => {
            console.log('📊 Received webhook stats:', stats);
            setStats(stats);
        });

        // รับ log ใหม่แบบ real-time
        socket.on('webhook-log', (newLog) => {
            console.log('🆕 NEW WEBHOOK LOG RECEIVED:', newLog);

            // เพิ่ม log ใหม่ไปยัง newLogs
            setNewLogs(prev => [newLog, ...prev.slice(0, 4)]); // เก็บ 5 log ล่าสุด

            // อัพเดท logs list ด้วย - เพิ่ม log ใหม่ไว้ด้านบน
            setLogs(prev => {
                // ตรวจสอบว่า log นี้มีอยู่แล้วหรือไม่
                const existingIndex = prev.findIndex(log => log.id === newLog.id);
                if (existingIndex !== -1) {
                    // ถ้ามีอยู่แล้ว ให้อัพเดท log เดิม
                    const updatedLogs = [...prev];
                    updatedLogs[existingIndex] = newLog;
                    return updatedLogs;
                } else {
                    // ถ้าไม่มี ให้เพิ่ม log ใหม่ไว้ด้านบน
                    return [newLog, ...prev];
                }
            });

            // อัพเดท stats
            if (newLog.status === 'success') {
                setStats(prev => ({
                    ...prev,
                    success: (prev.success || 0) + 1,
                    total: (prev.total || 0) + 1,
                    successRate: prev.total > 0 ? (((prev.success || 0) + 1) / ((prev.total || 0) + 1) * 100).toFixed(2) : '100'
                }));
            } else {
                setStats(prev => ({
                    ...prev,
                    failed: (prev.failed || 0) + 1,
                    total: (prev.total || 0) + 1,
                    successRate: prev.total > 0 ? ((prev.success || 0) / ((prev.total || 0) + 1) * 100).toFixed(2) : '0'
                }));
            }
        });

        // จัดการ error
        socket.on('webhook-logs-error', (error) => {
            console.error('❌ Error fetching logs:', error);
        });

        socket.on('webhook-stats-error', (error) => {
            console.error('❌ Error fetching stats:', error);
        });

        // Disconnect
        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('❌ Disconnected from WebSocket');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handlePageChange = (newPage) => {
        if (socketRef.current) {
            socketRef.current.emit('get-webhook-logs', {
                page: newPage,
                limit: pagination.limit || 20
            });
        }
    };

    const sendTestWebhook = async () => {
        try {
            const testPayload = {
                id_no: 'TEST-' + Date.now(),
                event_type: 'test_event',
                message: 'This is a test webhook from frontend',
                timestamp: new Date().toISOString(),
            };

            const response = await fetch('http://localhost:3007/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testPayload),
            });

            const result = await response.json();
            console.log('✅ Test webhook sent:', result);
        } catch (error) {
            console.error('❌ Failed to send test webhook:', error);
        }
    };

    const resendWebhook = async (payload: any) => {
        console.log("Resending webhook with payload:", payload);

        try {
            const res = await fetch(`http://localhost:3007/event/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ payload }),
            });

            if (res.ok) {
                alert("✅ Webhook resent successfully");
                // รีดึงข้อมูลใหม่
                if (socketRef.current) {
                    socketRef.current.emit('get-webhook-logs', {
                        page: 1,
                        limit: 20
                    });
                }
            } else {
                const errorText = await res.text();
                console.error("Backend error:", errorText);
                alert(`❌ Failed to resend webhook: ${errorText}`);
            }
        } catch (err) {
            console.error("Resend error:", err);
            alert("❌ Error occurred while resending webhook");
        }
    };

    return (
        <div className="webhook-dashboard">
            <div className="header">
                <h1>🔄 Real-time Webhook Dashboard</h1>
                <div className="connection-status">
                    Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total</h3>
                    <div className="stat-value">{stats.total || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Success</h3>
                    <div className="stat-value success">{stats.success || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Failed</h3>
                    <div className="stat-value failed">{stats.failed || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Success Rate</h3>
                    <div className="stat-value">{stats.successRate || '0'}%</div>
                </div>
            </div>

            {/* Real-time New Logs */}
            {newLogs.length > 0 && (
                <div className="realtime-section">
                    <h2>🆕 Real-time New Logs</h2>
                    <div className="new-logs">
                        {newLogs.map((log, index) => (
                            <div key={`new-${log.id}-${log.received_at}-${index}`} className={`log-item new ${log.status}`}>
                                <div className="log-header">
                                    <span className="event-type">{log.event_type}</span>
                                    <span className={`status ${log.status}`}>{log.status}</span>
                                    <span className="timestamp">{new Date(log.received_at).toLocaleTimeString()}</span>
                                </div>
                                <div className="log-details">
                                    <span className="rabbitmq-id">ID: {log.rabbitmq_id}</span>
                                    {log.errorMessage && (
                                        <span className="error">Error: {log.errorMessage}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Test Button */}
            <div className="test-section">
                <button onClick={sendTestWebhook} className="test-button">
                    🧪 Send Test Webhook
                </button>
            </div>

            {/* Logs Table */}
            <div className="logs-section">
                <h2>📋 Webhook Logs</h2>
                {logs.length > 0 ? (
                    <div className="logs-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Event Type</th>
                                    <th>Status</th>
                                    <th>RabbitMQ ID</th>
                                    <th>Received At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className={log.status}>
                                        <td>{log.id}</td>
                                        <td>{log.event_type}</td>
                                        <td>
                                            <span className={`status-badge ${log.status}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="rabbitmq-id">{log.rabbitmq_id}</td>
                                        <td>{new Date(log.received_at).toLocaleString()}</td>
                                        <td>
                                            <button
                                                onClick={() => resendWebhook(log.payload)}
                                                disabled={log.active === 0}
                                                className="resend-button"
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    cursor: log.active === 0 ? 'not-allowed' : 'pointer',
                                                    backgroundColor: log.active === 0 ? '#6c757d' : '#ffc107',
                                                    color: 'white',
                                                    fontSize: '0.8em',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Resend
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No logs found</p>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={!pagination.hasPrev}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="pagination-btn"
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                        disabled={!pagination.hasNext}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="pagination-btn"
                    >
                        Next →
                    </button>
                </div>
            )}

            <style jsx>{`
        .webhook-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #ffffff;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .header h1 {
          color: #1a1a1a;
          margin: 0;
        }

        .connection-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          background-color: #e9ecef;
          color: #495057;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
          border: 1px solid #dee2e6;
        }

        .stat-card h3 {
          color: #495057;
          margin: 0 0 10px 0;
        }

        .stat-value {
          font-size: 2em;
          font-weight: bold;
          margin-top: 10px;
          color: #212529;
        }

        .stat-value.success { color: #198754; }
        .stat-value.failed { color: #dc3545; }

        .realtime-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 1px solid #dee2e6;
        }

        .realtime-section h2 {
          color: #1a1a1a;
          margin: 0 0 15px 0;
        }

        .new-logs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .log-item {
          background: #ffffff;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #0d6efd;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .log-item.success { border-left-color: #198754; }
        .log-item.failed { border-left-color: #dc3545; }
        .log-item.new { animation: slideIn 0.3s ease-out; }

        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .event-type {
          font-weight: bold;
          color: #1a1a1a;
        }

        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8em;
          font-weight: bold;
        }

        .status.success { background: #d1e7dd; color: #0f5132; }
        .status.failed { background: #f8d7da; color: #721c24; }

        .log-details {
          font-size: 0.9em;
          color: #6c757d;
        }

        .rabbitmq-id {
          font-family: monospace;
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 3px;
          color: #495057;
        }

        .error {
          color: #dc3545;
          margin-left: 10px;
        }

        .test-section {
          text-align: center;
          margin: 20px 0;
        }

        .test-button {
          background: #0d6efd;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.2s;
        }

        .test-button:hover {
          background: #0b5ed7;
        }

        .logs-section {
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #dee2e6;
        }

        .logs-section h2 {
          padding: 20px;
          margin: 0;
          border-bottom: 1px solid #dee2e6;
          color: #1a1a1a;
        }

        .logs-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
          color: #1a1a1a;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8em;
          font-weight: bold;
        }

        .status-badge.success { background: #d1e7dd; color: #0f5132; }
        .status-badge.failed { background: #f8d7da; color: #721c24; }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .pagination-btn {
          background: #0d6efd;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .pagination-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .page-info {
          font-weight: bold;
          color: #495057;
        }
      `}</style>
        </div>
    );
};

export default RealtimeWebhookDashboard;
