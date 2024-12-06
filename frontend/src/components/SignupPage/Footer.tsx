const Footer = () => {
  return (
    <div className={`flex space-y-1 text-xs text-center flex-col items-center justify-center`}>
          <p className={` w-[240px] `}>By signing up, you agree with the</p>
          <p className="w-[240px]"><span className='underline hover:cursor-pointer'>Terms of Use</span > & <span className='underline hover:cursor-pointer'> Privacy Policy</span></p>
    </div>
  )
}

export default Footer