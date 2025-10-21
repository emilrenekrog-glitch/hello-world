const Layout = ({ as = 'div', className = '', children, ...rest }) => {
  const Component = as
  const classes = ['layout-container', className].filter(Boolean).join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Layout
