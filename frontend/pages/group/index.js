import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import EventButton from '@/components/event/EventButton'
import GroupBanner from '@/components/group/GroupBanner'
import GroupDetailModal from '@/components/group/GroupDetailModal'
import GroupJoin from '@/components/group/GroupJoin'
import GroupNavbar from '@/components/group/GroupNavbar'

const Group = () => {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const eventName = searchParams.get('eventName')

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(30)
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [loading, setLoading] = useState(true)

  // 搜尋和篩選狀態
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' 或 'oldest'
  const [filterEvent, setFilterEvent] = useState(eventId || 'all')

  // Modal 狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    fetchGroups()
  }, [currentPage])

  // 當搜尋條件、排序或篩選改變時，重新過濾群組
  useEffect(() => {
    filterAndSortGroups()
  }, [searchTerm, sortOrder, filterEvent, groups])

  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/group/all', {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.status === 'success') {
        setGroups(data.data.groups || [])
        filterAndSortGroups()
      } else {
        console.error('獲取群組失敗:', data.message)
        setGroups([])
        setFilteredGroups([])
      }
    } catch (error) {
      console.error('獲取群組失敗:', error)
      setGroups([])
      setFilteredGroups([])
    } finally {
      setLoading(false)
    }
  }

  // 過濾和排序群組
  const filterAndSortGroups = () => {
    let result = [...groups]

    // 搜尋過濾
    if (searchTerm) {
      result = result.filter(
        (group) =>
          group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 活動篩選
    if (filterEvent && filterEvent !== 'all') {
      result = result.filter((group) => group.event_id === filterEvent)
    }

    // 時間排序
    result.sort((a, b) => {
      const timeA = new Date(a.creat_time).getTime()
      const timeB = new Date(b.creat_time).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    setFilteredGroups(result)
    setTotalPages(Math.ceil(result.length / 8))
    setCurrentPage(1) // 重置頁碼
  }

  // 搜尋處理
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // 排序處理
  const handleSort = (e) => {
    setSortOrder(e.target.value)
  }

  // 篩選處理
  const handleFilter = (e) => {
    setFilterEvent(e.target.value)
  }

  // 詳情 Modal 控制函數
  const handleOpenModal = (groupData) => {
    setSelectedGroup({
      id: groupData.group_id,
      title: groupData.group_name,
      description: groupData.description,
      date: groupData.creat_time,
      currentMembers: groupData.member_count || 0,
      maxMembers: groupData.max_members,
      creator_name: groupData.creator_name,
      creator_id: groupData.creator_id,
      users: groupData.members || [],
      eventId: groupData.event_id,
      eventName: groupData.event_name,
    })
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGroup(null)
    document.body.style.overflow = 'unset'
  }

  // 申請 Modal 控制函數
  const handleOpenJoinModal = (groupData) => {
    if (!groupData) {
      setIsModalOpen(false)
    } else {
      setSelectedGroup(groupData)
    }
    setIsJoinModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false)
    if (!isModalOpen) {
      setSelectedGroup(null)
    }
    document.body.style.overflow = 'unset'
  }

  // 生成頁碼數組
  const generatePaginationItems = () => {
    let items = []
    items.push(1)
    let start = Math.max(2, currentPage - 1)
    let end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      items.push('...')
    }

    for (let i = start; i <= end; i++) {
      items.push(i)
    }

    if (end < totalPages - 1) {
      items.push('...')
    }

    if (totalPages > 1) {
      items.push(totalPages)
    }

    return items
  }

  // 處理頁面切換
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // 計算當前頁面應顯示的群組
  const getCurrentPageGroups = () => {
    const startIndex = (currentPage - 1) * 8
    return filteredGroups.slice(startIndex, startIndex + 8)
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="group-wrapper">
      <div className="group-container">
        {/* 導航區域 */}
        <nav className="group-nav-section mb-2">
          <div className="group-nav-container">
            <h1 className="group-nav-title">揪團列表</h1>
            <Link
              href={
                eventId
                  ? `/group/groupCreat?eventId=${eventId}&eventName=${eventName}`
                  : '/group/groupCreat'
              }
              style={{ textDecoration: 'none' }}
            ></Link>
          </div>
        </nav>

        {/* 搜尋和篩選區域 */}
        <GroupNavbar />

        {/* 內容區域 */}
        <div className="group-content">
          {filteredGroups.length === 0 ? (
            <div className="no-groups-message">
              {loading ? '載入中...' : '找不到符合條件的揪團'}
            </div>
          ) : (
            <div className="group-banner-grid">
              {getCurrentPageGroups().map((group) => (
                <div key={group.group_id}>
                  <GroupBanner
                    groupData={{
                      id: group.group_id,
                      title: group.group_name,
                      creatorId: group.creator_id,
                      creatorName: group.creator_name,
                      createTime: group.creat_time,
                      currentMembers: group.member_count || 0,
                      maxMembers: group.max_members,
                      description: group.description,
                      image: group.group_img,
                      eventId: group.event_id,
                      eventName: group.event_name,
                    }}
                    onOpenDetail={() => handleOpenModal(group)}
                    onOpenJoin={() => handleOpenJoinModal(group)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 分頁導航 */}
          {filteredGroups.length > 0 && (
            <nav className="group-pagination-container">
              <ul className="group-pagination-list">
                {/* 上一頁按鈕 */}
                <li
                  className={`group-pagination-item ${
                    currentPage === 1 ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="group-pagination-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ⟨
                  </button>
                </li>

                {/* 頁碼 */}
                {generatePaginationItems().map((item, index) => (
                  <li
                    key={`page-${index}`}
                    className={`group-pagination-item ${
                      item === currentPage ? 'active' : ''
                    } ${item === '...' ? 'disabled' : ''}`}
                  >
                    <button
                      className="group-pagination-link"
                      onClick={() => item !== '...' && handlePageChange(item)}
                      disabled={item === '...'}
                    >
                      {item}
                    </button>
                  </li>
                ))}

                {/* 下一頁按鈕 */}
                <li
                  className={`group-pagination-item ${
                    currentPage === totalPages ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="group-pagination-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ⟩
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Modal 組件 */}
      {isModalOpen && (
        <GroupDetailModal
          onClose={handleCloseModal}
          groupData={selectedGroup}
          onJoin={() => handleOpenJoinModal()}
        />
      )}

      {/* 申請加入 Modal */}
      {isJoinModalOpen && (
        <GroupJoin onClose={handleCloseJoinModal} groupData={selectedGroup} />
      )}
    </div>
  )
}

export default Group
