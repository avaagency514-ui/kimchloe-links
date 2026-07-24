import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfileHeader({ profile }: { profile: any }) {
  if (!profile) return null

  return (
    <div className="flex flex-col items-center text-center pb-8 border-b border-black/5">
      <Avatar className="h-28 w-28 border-4 border-white shadow-xl mb-6 bg-slate-100">
        <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
        <AvatarFallback className="text-4xl text-slate-400">{profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <h1 className="text-3xl font-black text-slate-900 drop-shadow-sm mb-1">{profile.full_name || profile.username}</h1>
      <p className="text-lg text-slate-600 font-medium">@{profile.username}</p>
      {profile.bio && (
        <p className="mt-5 text-slate-600 max-w-sm mx-auto leading-relaxed bg-white/40 p-4 rounded-2xl shadow-sm">
          {profile.bio}
        </p>
      )}
    </div>
  )
}
