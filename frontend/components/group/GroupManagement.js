import React, { useState, useEffect } from 'react'
import styles from './GroupManagement.module.css'

const GroupList = () => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUserGroups()
  }, [])

  const fetchUserGroups = async () => {
    try {
      // 第一個請求：獲取使用者參與的群組
      const memberResponse = await fetch(
        'http://localhost:3005/api/group/user',
        {
          credentials: 'include',
        }
      )
      const memberData = await memberResponse.json()

      // 第二個請求：獲取使用者創建的群組
      const creatorResponse = await fetch(
        'http://localhost:3005/api/group/creator',
        {
          credentials: 'include',
        }
      )
      const creatorData = await creatorResponse.json()

      if (memberData.status === 'success' && creatorData.status === 'success') {
        // 合併創建和參與的群組，並標記身份
        const combinedGroups = [
          ...memberData.data.groups.map((group) => ({
            ...group,
            role: 'member',
          })),
          ...creatorData.data.groups.map((group) => ({
            ...group,
            role: 'creator',
          })),
        ]

        // 移除重複的群組（如果同時是創建者和成員）
        const uniqueGroups = combinedGroups.reduce((acc, current) => {
          const x = acc.find((item) => item.group_id === current.group_id)
          if (!x) {
            return acc.concat([current])
          } else if (current.role === 'creator') {
            // 如果當前項是創建者，替換掉成員身份的項
            return acc.map((item) =>
              item.group_id === current.group_id ? current : item
            )
          }
          return acc
        }, [])

        setGroups(uniqueGroups)
      } else {
        setError(memberData.message || creatorData.message)
      }
    } catch (error) {
      console.error('獲取群組失敗:', error)
      setError('獲取群組資料失敗')
    } finally {
      setLoading(false)
    }
  }

  // 刪除群組
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('確定要刪除此群組？')) return

    try {
      const response = await fetch(
        `http://localhost:3005/api/group/${groupId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await response.json()
      if (data.status === 'success') {
        // 重新載入群組列表
        fetchUserGroups()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('刪除群組失敗:', error)
      alert('刪除群組失敗')
    }
  }

  // 處理圖片路徑
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'http://localhost:3005/uploads/groups/group-default.png'
    }
    return `http://localhost:3005${imagePath}`
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (groups.length === 0) return <div>目前沒有參加或創建的群組</div>

  return (
    <div className={`container py-2`}>
      <div className={styles.groupList}>
        <div className={styles.listHeader}>
          <div className={styles.listTitle}>
            <i className="bi bi-people-fill"></i>
            揪團資訊
          </div>
        </div>

        <div
          className={`${styles.listRow} ${styles.desktopHeader} d-none d-md-block`}
        >
          <div className="row align-items-center">
            <div className="col-2"></div>
            <div className="col-3">揪團名稱</div>
            <div className="col-2">時間</div>
            <div className="col-2">人數</div>
            <div className="col-2">身份</div>
            <div className="col-1">編輯</div>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.group_id} className={styles.listRow}>
            <div className="row align-items-center d-none d-md-flex">
              <div className="col-2">
                <img
                  src={getImageUrl(group.group_img)}
                  alt="揪團圖片"
                  className={styles.groupImg}
                  onError={(e) => {
                    e.target.src =
                      'http://localhost:3005/uploads/groups/group-default.png'
                  }}
                />
              </div>
              <div className="col-3">{group.group_name}</div>
              <div className="col-2">
                {new Date(group.creat_time).toLocaleString()}
              </div>
              <div className="col-2">
                {group.member_count}/{group.max_members}
              </div>
              <div className="col-2">
                {group.role === 'creator' ? '創建者' : '參加者'}
              </div>
              <div className="col-1">
                <div className="d-flex gap-2">
                  {group.role === 'creator' && (
                    <>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          (window.location.href = `/group/edit/${group.group_id}`)
                        }
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDeleteGroup(group.group_id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className={`${styles.mobileLayout} d-block d-md-none`}>
              <div className={styles.mobileImgWrapper}>
                <img
                  src={getImageUrl(group.group_img)}
                  alt="揪團圖片"
                  className={styles.groupImg}
                  onError={(e) => {
                    e.target.src =
                      'http://localhost:3005/uploads/groups/group-default.png'
                  }}
                />
              </div>
              <div className={styles.mobileInfo}>
                <div className={styles.mobileTitle}>{group.group_name}</div>
                <div className={styles.mobileDetails}>
                  <div className={styles.mobileStats}>
                    <span>
                      <i className="bi bi-clock"></i>{' '}
                      {new Date(group.creat_time).toLocaleString()}
                    </span>
                    <span>
                      <i className="bi bi-people"></i> {group.member_count}/
                      {group.max_members}
                    </span>
                    <span>
                      <i className="bi bi-person-badge"></i>{' '}
                      {group.role === 'creator' ? '創建者' : '參加者'}
                    </span>
                  </div>
                  {group.role === 'creator' && (
                    <div className={styles.mobileActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() =>
                          (window.location.href = `/group/edit/${group.group_id}`)
                        }
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleDeleteGroup(group.group_id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupList
