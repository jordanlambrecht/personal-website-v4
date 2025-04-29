'use client'
import type { CodeFieldClient, CodeFieldClientProps } from 'payload'

import { CodeField, useFormFields } from '@payloadcms/ui'
import React, { useMemo } from 'react'

export const languages = {
  ts: 'TypeScript',
  plaintext: 'Plain Text',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
}

const languageKeyToMonacoLanguageMap = {
  plaintext: 'plaintext',
  ts: 'typescript',
  tsx: 'typescript',
}

type Language = keyof typeof languageKeyToMonacoLanguageMap

const Code: React.FC<CodeFieldClientProps> = ({
  autoComplete,
  field,
  forceRender,
  path,
  permissions,
  readOnly,
  renderedBlocks,
  schemaPath,
  validate,
}) => {
  const languageField = useFormFields(([fields]) => fields['language'])

  const language: Language =
    (languageField?.value as Language) || (languageField?.initialValue as Language) || 'ts'

  const label = languages[language]

  const props: CodeFieldClient = useMemo<CodeFieldClient>(
    () => ({
      ...field,
      type: 'code',
      admin: {
        ...field.admin,
        editorOptions: undefined,
        language: languageKeyToMonacoLanguageMap[language] || language,
      },
      label,
    }),
    [field, language, label],
  )

  const key = `${field.name}-${language}-${label}`

  return (
    <CodeField
      autoComplete={autoComplete}
      field={props}
      forceRender={forceRender}
      key={key}
      path={path}
      permissions={permissions}
      readOnly={readOnly}
      renderedBlocks={renderedBlocks}
      schemaPath={schemaPath}
      validate={validate}
    />
  )
}
export default Code
