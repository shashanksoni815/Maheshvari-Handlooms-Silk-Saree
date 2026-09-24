import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Basic filtering for UI
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.admin?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.admin?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.resourceId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (log.details?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-primary">System Audit Logs</h2>
          <p className="text-sm text-muted mt-1">Track admin activity and system changes</p>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-supporting overflow-hidden">
        <div className="p-4 border-b border-supporting bg-gray-50 flex gap-4 flex-col sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Search by admin, ID, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent text-sm w-full sm:max-w-xs"
          />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-supporting rounded-sm focus:ring-1 focus:ring-accent text-sm"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
        ) : (
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-left text-sm text-secondary">
              <thead className="bg-white border-b border-supporting text-xs uppercase tracking-widest text-primary sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Admin</th>
                  <th className="px-6 py-4 font-semibold">Action & Resource</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap text-xs text-muted">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-primary">{log.admin?.firstName} {log.admin?.lastName}</div>
                      <div className="text-[10px] text-muted">{log.admin?.email}</div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="ml-2 font-mono text-xs font-semibold">{log.resource}</span>
                    </td>
                    <td className="px-6 py-3 text-xs max-w-sm">
                      <div className="truncate" title={typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || log.resourceId}>
                        {log.details ? (typeof log.details === 'object' ? JSON.stringify(log.details) : log.details) : <span className="text-muted font-mono">{log.resourceId}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-muted font-mono whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">No logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
