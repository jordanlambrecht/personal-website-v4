const InnerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-7xl flex flex-col w-full">{children}</div>
}

export default InnerWrapper
