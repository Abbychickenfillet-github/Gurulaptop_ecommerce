import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiamond } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { Upload } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Blogcreated(props) {
  const router = useRouter() // 加入 router

  // -------------------使用者-------------------
  const { auth } = useAuth()
  const { isAuth, userData } = auth // 一起解構
  const user_id = userData.user_id
  console.log(user_id)
  // -------------------使用者-------------------

  // 2. 用戶驗證，如果沒有登入就導向首頁或登入頁
  useEffect(() => {
    if (!isAuth) {
      router.push('http://localhost:3000/member/login')
    }
  }, [isAuth, router])
  // -------------------使用者-------------------

  const brands = [
    ['ROG', 'DELL', 'Acer', 'Raser'],
    ['GIGABYTE', 'MSI', 'HP', 'ASUS'],
  ]
  // 建立一個可重用的時間函數
  function getTimestamp() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // 狀態定義

  const [blog_type, setType] = useState('')
  const [blog_title, setTitle] = useState('')
  const [blog_content, setContent] = useState('')
  const [blog_brand, setBrand] = useState('')
  const [blog_brand_model, setBrandModel] = useState('')
  const [blog_keyword, setKeyword] = useState('')
  const [blog_valid_value, setValidvalue] = useState('1')
  const [blog_created_date, setDate] = useState(getTimestamp())
  const [blog_image, setImage] = useState(null)

  // 處理表單提交，把原本的預設狀態弄掉
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('user_id', user_id)
    formData.append('blog_type', blog_type)
    formData.append('blog_title', blog_title)
    formData.append('blog_content', blog_content)
    formData.append('blog_brand', blog_brand)
    formData.append('blog_brand_model', blog_brand_model)
    formData.append('blog_keyword', blog_keyword)
    formData.append('blog_valid_value', '1')
    formData.append('blog_created_date', getTimestamp())
    if (blog_image) {
      formData.append('blog_image', blog_image)
    }

    try {
      const response = await fetch(
        'http://localhost:3005/api/blog/blog-created',
        {
          method: 'POST',
          body: formData,
        }
      )
      console.log('成功連結')

      const result = await response.json()

      if (response.ok) {
        alert('部落格新增成功')
        if (result.blog_id) {
          // 導航到新建立的文章頁面
          router.push(`/blog/blog-user-detail/${result.blog_id}`)
        }
      } else {
        alert(`發生錯誤: ${result.message}`)
      }
    } catch (error) {
      console.error('錯誤:', error)
      alert('發生錯誤，請稍後再試')
    }
  }
  if (!isAuth) {
    return null // 或是返回一個 loading 元件
  }

  return (
    <div className="BlogEditAlignAllItems mt-5 w-100">
      {/* 圖片上傳區塊 */}
      <div className="">
        <div className="BlogEditSmallTitle text-nowrap">
          <p>
            <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
            {'\u00A0 '}
            新增封面圖片
          </p>
        </div>
      </div>
      <div
        className="BlogImgUploadDiv d-flex align-items-center justify-content-center "
        onClick={() => document.getElementById('imageInput').click()}
      >
        {blog_image ? (
          <img
            src={URL.createObjectURL(blog_image)}
            alt="預覽圖片"
            className="object-fit-cover w-100 h-100"
          />
        ) : (
          <>
            <div className="cursor-pointer">
              <Upload className="w-24 h-24" />
            </div>
          </>
        )}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: 'none' }}
          id="imageInput"
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* 標題區塊 */}
        <div className="d-flex align-items-start justify-content-start">
          <div className="BlogEditSmallTitle text-nowrap col-4">
            <p>
              <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
              {'\u00A0 '}
              標題
            </p>
          </div>
          <div className="col-8 col-lg-8 col-md-10">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="標題"
              value={blog_title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* 文章內容區塊 */}
        <div className="d-flex align-items-start justify-content-start mb-5 mt-5 col-6">
          <div className="BlogEditSmallTitle text-nowrap">
            <p>
              <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
              {'\u00A0 '}
              內文
            </p>
          </div>
          <div>
            <textarea
              className="form-control"
              style={{ width: '430%' }}
              value={blog_content}
              onChange={(e) => setContent(e.target.value)}
              rows="20"
              placeholder="請輸入內文"
            />
          </div>
        </div>

        {/* 品牌選擇區塊 */}
        <div className="d-flex flex-row justify-content-between align-items-start col-6 mb-5">
          <div className="BlogSmallTitleAlign d-flex justify-content-start align-items-start col-6">
            <div className="BlogEditSmallTitle text-nowrap">
              <p>
                <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
                {'\u00A0 '}
                筆電品牌
              </p>
            </div>
          </div>
          <div className="d-flex flex-row gap-5 justify-content-center">
            {brands.map((column, columnIndex) => (
              <div key={columnIndex} className="d-flex flex-column gap-5">
                {column.map((brand) => (
                  <div
                    key={brand}
                    className={`BlogEditBrandSelected d-flex justify-content-center align-items-center ${
                      brand === blog_brand ? 'BlogEditBrandSelectedActive' : ''
                    }`}
                    onClick={() => setBrand(brand)}
                  >
                    <p className="m-0">{brand}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 標題區塊 */}
        <div className="d-flex align-items-start justify-content-start mt-5 mb-5">
          <div className="BlogEditSmallTitle text-nowrap col-4">
            <p>
              <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
              {'\u00A0 '}
              筆電型號
            </p>
          </div>
          <div className="col-8 col-lg-8 col-md-10">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="標題"
              value={blog_brand_model}
              onChange={(e) => setBrandModel(e.target.value)}
            />
          </div>
        </div>
        {/* 類別選擇區塊 */}
        <div className="d-flex flex-row justify-content-between align-items-start col-12 mb-5">
          <div className="BlogEditSmallTitle text-nowrap col-10">
            <p>
              <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
              {'\u00A0 '}
              類別
            </p>
          </div>
          <div className="d-flex flex-column gap-5 col-9">
            {['購買心得', '開箱文', '疑難雜症', '活動心得'].map((v) => (
              <div
                key={v}
                className={`BlogEditBrandSelected d-flex justify-content-center align-items-center ${
                  v === blog_type ? 'BlogEditBrandSelectedActive' : ''
                }`}
                onClick={() => setType(v)}
              >
                <p>{v}</p>
              </div>
            ))}
          </div>
        </div>
        {/* 關鍵字區塊 */}
        <div className="d-flex align-items-start justify-content-start">
          <div className="BlogEditSmallTitle text-nowrap col-4">
            <p>
              <FontAwesomeIcon icon={faDiamond} className="TitleDiamond" />
              {'\u00A0 '}
              關鍵字
            </p>
          </div>
          <div className="col-8 col-lg-8 col-md-10">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="輸入一組你喜歡的關鍵字！"
              value={blog_keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* 按鈕區塊 */}
        <div className="d-flex flex-row justify-content-around align-items-center mt-5">
          <button className="BlogEditButtonSubmit" type="submit">
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
