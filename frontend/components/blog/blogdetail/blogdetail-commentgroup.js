import React, { useState, useEffect } from 'react'

export default function BlogComments({ blog_id }) {
  const [comments, setBlogComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`api/blog/blog_detail/${blog_id}`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        console.log('Fetched comments data:', data)
        // 確保返回的 data 是陣列，若不是則設置為空陣列
        if (Array.isArray(data)) {
          setBlogComments(data) // 更新狀態
        } else {
          console.error('Returned data is not an array:', data)
          setBlogComments([]) // 設置為空陣列，防止錯誤
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
        setBlogComments([]) // 如果錯誤，設置為空陣列
      }
    }

    fetchComments()
  }, [blog_id])

  return (
    <>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div
            key={comment.blog_comment_userId}
            className="mb-5 BlogDetailComment"
          >
            <div className="m-4">
              <p>#{index + 1}</p>
              <hr />
              <div className="w-50 h-50 d-flex flex-row align-items-start justify-content-between">
                <div className="overflow-hidden BlogDetailCommentImg">
                  <img
                    className="w-100 h-100 object-fit-cover"
                    src="https://th.bing.com/th/id/R.88c444f63f40cfa9b49801f826befa80?rik=QAme0H3xbxieEQ&pid=ImgRaw&r=0" // 預設圖片
                    alt={comment.blog_comment_userId} // 使用 userId 作為 alt
                  />
                </div>
                <p>{comment.blog_comment_userId}</p>{' '}
                {/* 假設用戶名使用 userId */}
                <p>
                  於{' '}
                  {new Date(comment.blog_comment_created_time).toLocaleString()}{' '}
                  留言
                </p>
                <p>{comment.blog_valid_value ? '普通會員' : '其他角色'}</p>{' '}
                {/* 根據 valid_value 顯示角色 */}
              </div>
              <div className="w-100 h-100 mt-5 mb-5">
                {comment.blog_comment_text} {/* 顯示留言內容 */}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No comments available</p> // 顯示當沒有留言時的提示
      )}
    </>
  )
}