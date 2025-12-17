export default function RecruitmentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">求人管理</h1>
      <div className="space-y-6">
        {[
          {
            id: '1',
            title: 'ホールスタッフ募集',
            type: 'アルバイト',
            salary: '時給 1,200円〜',
            status: '募集中',
          },
          {
            id: '2',
            title: 'キッチンスタッフ募集',
            type: 'アルバイト',
            salary: '時給 1,300円〜',
            status: '募集中',
          },
          {
            id: '3',
            title: '店長候補募集',
            type: '正社員',
            salary: '月給 280,000円〜',
            status: '応募あり',
          },
        ].map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {job.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      job.status === '募集中'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700">{job.salary}</p>
            </div>
            <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
              詳細を見る →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
