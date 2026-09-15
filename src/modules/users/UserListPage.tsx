import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminUsersApi } from '@/api/adminUsers';
import { AdminMemberDto } from '@/types';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { getErrorMessage } from '@/api/client';

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleString('ko-KR');
  } catch {
    return value;
  }
};

export const UserListPage: React.FC = () => {
  const [items, setItems] = useState<AdminMemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 20;

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; size: number; search?: string } = { page, size };
      if (search) params.search = search;
      const res = await adminUsersApi.getList(params);
      setItems(res.content || []);
      setTotalPages(res.totalPages ?? 0);
    } catch (err) {
      setError(getErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput.trim());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">회원 관리</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1 max-w-md"
          placeholder="이메일 또는 닉네임 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">검색</Button>
      </form>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">글 수</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      회원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-2 text-sm text-gray-500">{row.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.nickname}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{formatDate(row.createdAt)}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{row.postCount}</td>
                      <td className="px-4 py-2 text-sm text-right">
                        <Link to={`/users/${row.id}`} className="text-blue-600 hover:underline">
                          상세
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex gap-2 justify-center">
              <Button variant="secondary" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
                이전
              </Button>
              <span className="py-2">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
