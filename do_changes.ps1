import System.IO
import System.Text

$content = [File]::ReadAllText("c:\Users\andre\OneDrive\Documentos\WEB FUNDACION\frontend\src\app\page.tsx", [Encoding]::UTF8)

# Add Link import
$content = $content -replace "import \{ motion \} from 'framer-motion'", "import Link from 'next/link';`nimport { motion } from 'framer-motion'"

# Replace the buttons div with centered single button
$pattern = '<div className="flex flex-col sm:flex-row gap-6 justify-center">[\s\S]*?<motion\.button[^>]*>[^<]*</motion\.button>[\s\S]*?<motion\.button[^>]*>[\s\S]*?</div>'
$replacement = '<div className="flex justify-center">' + [char]13 + [char]10 +
               '              <Link href="/registro">' + [char]13 + [char]10 +
               '                <motion.button' + [char]13 + [char]10 +
               '                  whileHover=\{\{ scale: 1.05 \}\}' + [char]13 + [char]10 +
               '                  whileTap=\{\{ scale: 0.95 \}\}' + [char]13 + [char]10 +
               '                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"' + [char]13 + [char]10 +
               '                >' + [char]13 + [char]10 +
               '                  Registrarse como Voluntario' + [char]13 + [char]10 +
               '                </motion.button>' + [char]13 + [char]10 +
               '              </Link>' + [char]13 + [char]10 +
               '            </div>'

$content = $content -replace $pattern, $replacement

[File]::WriteAllText("c:\Users\andre\OneDrive\Documentos\WEB FUNDACION\frontend\src\app\page.tsx", $content, [Encoding]::UTF8)
Write-Host "Done"
