const Layout = ({ as: Component = 'div', className = '', children, ...rest }) => {
  const classes = ['layout-container', className].filter(Boolean).join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Layout
