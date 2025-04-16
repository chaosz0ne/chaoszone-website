--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
import           Data.Monoid ((<>))
import           Hakyll
-- import           Hakyll.Web.Sass

import           Data.Time.Clock (UTCTime, getCurrentTime)
import           Data.Time.Format (parseTimeM, defaultTimeLocale, formatTime)
import           Data.List
import           Data.Maybe (fromMaybe)
import           System.FilePath (takeFileName)
import           Control.Monad (liftM)
import           Network.HTTP.Base (urlEncode)

--------------------------------------------------------------------------------

baseUrl :: String
baseUrl = "https://chaoszone.cz"

main :: IO ()
main = do
  curtime <- formatTime defaultTimeLocale "%A %F %H:%M" <$> getCurrentTime
  hakyllWith config $ do

    let defaultCtx = constField "curtime" curtime <> defaultContext

    is <- sortIdentifiersByDate <$> getMatches "site/posts/*.md"

    match "templates/*" $ compile templateBodyCompiler

    match
      (    "site/images/**"
      .||. "site/fonts/**"
      .||. "site/humans.txt"
      .||. "site/robots.txt"
      ) $ do
        route   myRoute
        compile copyFileCompiler

    match "site/css/*.css" $ do
        route   myRoute
        compile compressCssCompiler

    match (fromList ["site/about.md", "site/contact.md"]) $ do
        route   $ myRoute `composeRoutes` setExtension "html"
        compile $ do
            pandocCompiler
                >>= loadAndApplyTemplate "templates/default.html"
                        -- (menuCtx firstUrl latestUrl)
                        defaultCtx
                >>= relativizeUrls

    -- create ["index.html"] $ do
    --     route idRoute
    --     compile $ do
    --         post <- fmap head . recentFirst =<< (loadAll "site/posts/*"
    --             :: Compiler [Item String])
    --         let indexCtx =
    --                 constField "date" "%B %e, %Y" <>
    --                 defaultCtx
    --         makeItem (itemBody post)
    --             >>= relativizeUrls

    match "site/index.md" $ do
        route $ myRoute `composeRoutes` setExtension "html"
        compile $ do
            posts <- fmap (take 5) . recentFirst =<< loadAll "site/posts/*"
            let indexCtx = listField "posts" postCtx (return posts) <>
                    constField "title" "Home" <>
                    defaultCtx
            getResourceBody
              >>= applyAsTemplate indexCtx
              >>= renderPandoc
              >>= loadAndApplyTemplate "templates/default.html" defaultCtx
              >>= relativizeUrls

    create ["archive.html"] $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "site/posts/*"
            let archiveCtx =
                    listField "posts" postCtx (return posts) <>
                    constField "title" "Archives"            <>
                    -- (menuCtx firstUrl latestUrl)
                    defaultCtx
            makeItem ""
                >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
                >>= loadAndApplyTemplate "templates/default.html" archiveCtx
                >>= relativizeUrls

    pages <- buildPaginateWith
        (liftM (paginateEvery 1) . sortRecentFirst)
        "site/posts/*.md"
        (\n -> is !! (n - 1))

    paginateRules pages $ \num pat -> do
        route   $ myRoute `composeRoutes` setExtension "html"
        compile $ do
            ident <- getUnderlying
            title <- getMetadataField' ident "title"
            url   <- return . fromMaybe "" =<< getRoute ident
            compiled <- getResourceBody >>= renderPandoc
            let pageCtx = paginateContext pages num
            let flattrCtx = constField "enctitle" (urlEncode title) <>
                            constField "encurl"   (urlEncode $ baseUrl ++ url)
            let ctx = postCtx <> pageCtx <> flattrCtx
            full <- loadAndApplyTemplate "templates/post.html" ctx compiled
            _ <- saveSnapshot "content" compiled
            loadAndApplyTemplate "templates/default.html"
              defaultCtx full
                >>= relativizeUrls

    create ["atom.xml"] $ do
      route idRoute
      compile $ do
        loadAllSnapshots "site/posts/*.md" "content"
          >>= recentFirst
          >>= renderAtom feedConf feedCtx

    create ["rss.xml"] $ do
      route idRoute
      compile $ do
        loadAllSnapshots "site/posts/*.md" "content"
          >>= recentFirst
          >>= renderRss feedConf feedCtx

--------------------------------------------------------------------------------

myRoute :: Routes
myRoute = gsubRoute "site/" (const "")

--------------------------------------------------------------------------------
postCtx :: Context String
postCtx =
    dateField "date" "%B %e, %Y" <>
    defaultContext

-- menuCtx :: String -> String -> Context String
-- menuCtx first latest =
--     constField "first" first <>
--     constField "latest" latest <>
--     defaultCtx

--------------------------------------------------------------------------------
config :: Configuration
config = defaultConfiguration
  { deployCommand = "rsync --del --checksum -arve 'ssh -p 5557 ' _site/* chaoszone@chaoszone.cz:/home/chaoszone/www/chaoszone"
  }

--------------------------------------------------------------------------------

feedCtx :: Context String
feedCtx = mconcat
  [ bodyField "description"
  , defaultContext
  ]

--------------------------------------------------------------------------------

feedConf :: FeedConfiguration
feedConf = FeedConfiguration
  { feedTitle = "Chaosone news"
  , feedDescription = "News from eastern european hackerspaces"
  , feedAuthorName = "Chaoszone members"
  , feedAuthorEmail = "nek0@chaoszone.cz"
  , feedRoot = "https://chaoszone.cz"
  }

--------------------------------------------------------------------------------

sortIdentifiersByDate :: [Identifier] -> [Identifier]
sortIdentifiersByDate =
    sortBy byDate
  where
    byDate id1 id2 =
      let fn1 = takeFileName $ toFilePath id1
          fn2 = takeFileName $ toFilePath id2
          parseTime' fn = parseTimeM True defaultTimeLocale "%Y-%m-%d" $
            intercalate "-" $ take 3 $ splitAll "-" fn
      in compare
           (parseTime' fn1 :: Maybe UTCTime)
           (parseTime' fn2 :: Maybe UTCTime)
