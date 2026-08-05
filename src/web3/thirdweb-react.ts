/** 应用层使用的 thirdweb React hooks / 组件。统一从这里引入，不从 `thirdweb/react` 直接引。 */
export {
  AutoConnect,
  ConnectEmbed,
  lightTheme,
  ThirdwebProvider,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useIsAutoConnecting,
} from 'thirdweb/react'
